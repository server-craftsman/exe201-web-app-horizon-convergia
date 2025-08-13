import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTER_URL } from '@consts/router.path.const'
import { PaymentService } from '@services/payment/payment.service'
import { notificationMessage } from '@utils/helper'
import { useUserInfo } from '@hooks/index'
import { useCartStore } from '@hooks/modules/useCartStore'
import { useProduct } from '@hooks/modules/useProduct'
import { OrderService } from '@services/order/order.service'

interface CheckoutMeta {
    orderId?: string
    orderNumbers?: string[]
    total?: number
    selectedDetailIds?: string[]
}

interface CheckoutItemSnapshot { productId: string; quantity: number }

const OrderPage: React.FC = () => {
    const navigate = useNavigate()
    const user = useUserInfo()
    const { cart, loadCart } = useCartStore()
    const { useProductsByIds } = useProduct()

    const [meta, setMeta] = useState<CheckoutMeta | null>(null)
    const [snapshot, setSnapshot] = useState<CheckoutItemSnapshot[] | null>(null)

    useEffect(() => {
        const raw = sessionStorage.getItem('checkout_meta')
        const rawItems = sessionStorage.getItem('checkout_items')
        try {
            setMeta(raw ? JSON.parse(raw) : null)
        } catch { setMeta(null) }
        try {
            setSnapshot(rawItems ? JSON.parse(rawItems) : null)
        } catch { setSnapshot(null) }
    }, [])

    // Ensure cart is loaded to map selected detail IDs to cart details
    useEffect(() => {
        if (user?.id) loadCart(user.id)
    }, [user?.id])

    // If orderId missing but we have orderNumbers, try resolve via search
    useEffect(() => {
        const resolveOrderId = async () => {
            if (!meta || meta.orderId || !user?.id || !meta.orderNumbers || meta.orderNumbers.length === 0) return
            try {
                const resp = await OrderService.search({ buyerId: user.id, page: 1, pageSize: 50 })
                const list = (resp as any)?.data?.data?.items || (resp as any)?.data?.items || []
                const codes = new Set(meta.orderNumbers)
                const found = list.find((o: any) => codes.has(o?.orderNo || o?.code || o?.orderNumber || o?.orderCode))
                if (found?.id) {
                    setMeta(prev => prev ? { ...prev, orderId: found.id } : prev)
                }
            } catch { /* ignore */ }
        }
        resolveOrderId()
    }, [meta?.orderId, meta?.orderNumbers, user?.id])

    const selectedDetails = useMemo(() => {
        const ids = new Set(meta?.selectedDetailIds || [])
        let rows = (cart?.details || []).filter(d => ids.has(d.id))
        // Fallback: if no rows via ids, use snapshot productId + quantity
        if ((!rows || rows.length === 0) && snapshot && snapshot.length > 0) {
            rows = snapshot.map(s => ({
                id: `${meta?.orderId || 'tmp'}:${s.productId}`,
                cartId: cart?.id || '',
                productId: s.productId,
                productName: '',
                productImage: undefined,
                unitPrice: 0,
                quantity: s.quantity,
                subtotal: 0,
            })) as any
        }
        return rows
    }, [cart?.details, meta?.selectedDetailIds, snapshot, meta?.orderId])

    const productIds = (selectedDetails || []).map(d => d.productId)
    const { data: productMap } = useProductsByIds(productIds)

    const enrichedRows = useMemo(() => {
        return (selectedDetails || []).map(d => {
            const p = productMap?.[d.productId]
            const title = p ? `${p.brand || ''} ${p.model || ''}`.trim() : (d.productName || 'Sản phẩm')
            const image = p?.imageUrls?.[0] || d.productImage || 'https://via.placeholder.com/120x90?text=No+Image'
            const unitPrice = p?.price ?? d.unitPrice ?? 0
            const subtotal = unitPrice * d.quantity
            return { id: d.id, productId: d.productId, title, image, unitPrice, quantity: d.quantity, subtotal }
        })
    }, [selectedDetails, productMap])

    const totalPrice = useMemo(() => {
        if (typeof meta?.total === 'number' && meta.total > 0) return meta.total
        return enrichedRows.reduce((s, r) => s + r.subtotal, 0)
    }, [meta?.total, enrichedRows])

    const canPay = useMemo(() => !!meta && ((meta.orderId && meta.orderId.trim().length > 0) || (meta.orderNumbers && meta.orderNumbers.length > 0)), [meta])

    const handlePay = async () => {
        if (!meta) return
        try {
            const hasId = typeof meta.orderId === 'string' && meta.orderId.trim().length > 0
            if (!hasId) {
                notificationMessage('Thiếu mã đơn hàng để thanh toán (orderId)', 'error')
                return
            }
            const payload = {
                orderIds: [meta.orderId as string],
                paymentMethod: 'PayOS',
                description: 'Thanh toán đơn hàng'
            }
            const resp = await PaymentService.multiPayment(payload as any)
            const data = (resp as any)?.data
            const paymentUrl = data?.url
            if (paymentUrl) {
                window.location.href = paymentUrl
                return
            }
            notificationMessage('Không lấy được link thanh toán', 'error')
        } catch (e: any) {
            notificationMessage(e?.message || 'Lỗi thanh toán', 'error')
        }
    }

    if (!meta) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    Không có dữ liệu đơn hàng. <button className="text-amber-600" onClick={() => navigate(ROUTER_URL.CLIENT.CART)}>Quay lại giỏ</button>
                </div>
            </section>
        )
    }

    return (
        <section className="py-10 bg-gray-50">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Xác nhận và thanh toán</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Order details */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Customer info */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin khách hàng</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><span className="text-gray-500">Họ tên:</span> <b>{user?.name || '—'}</b></div>
                                <div><span className="text-gray-500">Email:</span> <b>{user?.email || '—'}</b></div>
                                <div><span className="text-gray-500">Số điện thoại:</span> <b>{(user as any)?.phoneNumber || '—'}</b></div>
                                <div><span className="text-gray-500">Địa chỉ giao:</span> <b>{user?.address || '—'}</b></div>
                            </div>
                        </div>

                        {/* Products list */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm đã chọn</h3>
                            <div className="divide-y">
                                {enrichedRows.map(row => (
                                    <div key={row.id} className="py-3 flex items-center gap-4">
                                        <img src={row.image} alt={row.title} className="w-16 h-16 rounded-lg object-cover border" />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-800 line-clamp-2">{row.title}</div>
                                            <div className="text-sm text-gray-500">Giá: {row.unitPrice.toLocaleString('vi-VN')} ₫ × {row.quantity}</div>
                                        </div>
                                        <div className="text-right font-semibold text-gray-800 min-w-[120px]">{row.subtotal.toLocaleString('vi-VN')} ₫</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Mã đơn</span>
                                <span className="font-semibold">{(meta.orderNumbers || []).join(', ') || meta.orderId}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-gray-600">Tổng thanh toán</span>
                                <span className="font-extrabold text-amber-600">{totalPrice.toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <hr className="my-4" />
                            {/* PayOS card */}
                            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                <div className="flex items-center gap-3 mb-3">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKOCs8yde-EAOZYYVAQ1Ztqt5yidi_ilpp_Q&s" alt="PayOS" className="h-6" onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/80x24?text=PayOS' }} />
                                    <span className="text-sm text-gray-500">Cổng thanh toán bảo mật</span>
                                </div>
                                <button disabled={!canPay} onClick={handlePay} className="w-full bg-gray-900 hover:bg-amber-600 text-white rounded-lg py-3 font-semibold disabled:opacity-60">
                                    Thanh toán với PayOS
                                </button>
                                <p className="text-[11px] text-gray-400 mt-2">Bằng cách tiếp tục, bạn đồng ý với điều khoản thanh toán của PayOS.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OrderPage