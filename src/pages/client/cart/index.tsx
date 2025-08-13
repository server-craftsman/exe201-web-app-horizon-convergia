import React, { useEffect, useState } from 'react'
import { useCartStore } from '@hooks/modules/useCartStore'
import { useUserInfo } from '@hooks/index'
import { OrderService } from '@services/order/order.service'
import { notificationMessage } from '@utils/helper'
import { useNavigate } from 'react-router-dom'
import { ROUTER_URL } from '@consts/router.path.const'
import { useProduct } from '@hooks/modules/useProduct'

const CartPage: React.FC = () => {
    const user = useUserInfo()
    const navigate = useNavigate()
    const { cart, isLoading, itemCount, loadCart, updateQuantity, removeDetail } = useCartStore()
    const { useProductsByIds } = useProduct()

    // Selection state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (user?.id) loadCart(user.id)
    }, [user?.id])

    // Fetch product details by productIds to enrich cart rows
    const productIds = (cart?.details || []).map(d => d.productId).filter(Boolean)
    const { data: productMap } = useProductsByIds(productIds)

    // Keep selection in sync with cart changes; default select all on first load
    useEffect(() => {
        const ids = (cart?.details || []).map(d => d.id)
        setSelectedIds(prev => {
            if (ids.length === 0) return new Set()
            if (prev.size === 0) return new Set(ids)
            const next = new Set<string>()
            ids.forEach(id => { if (prev.has(id)) next.add(id) })
            return next
        })
    }, [cart?.details])

    if (!user) return <div className="container mx-auto px-4 py-12 text-center text-gray-600">Vui lòng đăng nhập để xem giỏ hàng</div>

    const toggleOne = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id); else next.add(id)
            return next
        })
    }
    const toggleAll = () => {
        const ids = (cart?.details || []).map(d => d.id)
        const allSelected = selectedIds.size === ids.length
        setSelectedIds(allSelected ? new Set() : new Set(ids))
    }

    const selectedDetails = (cart?.details || []).filter(d => selectedIds.has(d.id))
    const selectedQuantityTotal = selectedDetails.reduce((s, d) => s + d.quantity, 0)
    const selectedTotal = selectedDetails.reduce((s, d) => s + d.subtotal, 0)
    const selectedProductsCount = selectedIds.size

    const handleCheckout = async () => {
        try {
            if (!cart || selectedIds.size === 0) {
                notificationMessage('Vui lòng chọn sản phẩm để thanh toán', 'warning');
                return;
            }

            const ids = Array.from(selectedIds)
            const shippingAddress = user.address || 'Địa chỉ nhận hàng'
            const discount = 0;

            const orderResp = await OrderService.createFromCart({ cartDetailIds: ids, shippingAddress: shippingAddress || '', discount });
            const raw = (orderResp as any)?.data;
            const orderData = raw?.data;
            const orderNumbers: string[] | undefined = raw?.orderNumbers || orderData?.orderNumbers;
            const createdOrderId: string | undefined = orderData?.id;

            if (!createdOrderId && (!orderNumbers || orderNumbers.length === 0)) {
                notificationMessage(raw?.message || 'Không tạo được đơn hàng', 'error');
                return;
            }

            if (raw?.message) notificationMessage(raw.message, 'success');

            // Persist meta to session for the order review page
            const snapshot = selectedDetails.map(d => ({ productId: d.productId, quantity: d.quantity }))
            sessionStorage.setItem('checkout_meta', JSON.stringify({
                orderId: createdOrderId,
                orderNumbers: orderNumbers || [],
                total: selectedTotal,
                selectedDetailIds: ids,
            }))
            sessionStorage.setItem('checkout_items', JSON.stringify(snapshot))

            navigate(ROUTER_URL.CLIENT.ORDER);
        } catch (e: any) {
            notificationMessage(e?.message || 'Lỗi khi tạo đơn', 'error');
        }
    }

    return (
        <section className="py-10 bg-gray-50 min-h-[60vh]">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Giỏ hàng của bạn ({itemCount} sản phẩm)</h1>

                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Đang tải giỏ hàng...</div>
                ) : !cart || (cart.details || []).length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Giỏ hàng trống</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 space-y-4">
                            {/* Select all row */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                                <label className="flex items-center gap-3 text-gray-700">
                                    <input type="checkbox" className="w-5 h-5" checked={selectedIds.size === (cart.details || []).length} onChange={toggleAll} />
                                    <span>Chọn tất cả</span>
                                </label>
                                <div className="text-sm text-gray-600">Đã chọn: <b>{selectedProductsCount} sản phẩm</b> • Tổng tạm tính: <b className="text-amber-600">{selectedTotal.toLocaleString('vi-VN')} ₫</b></div>
                            </div>

                            {(cart.details || []).map(detail => {
                                const p = productMap?.[detail.productId];
                                const title = p ? `${p.brand || ''} ${p.model || ''}`.trim() : (detail.productName || 'Sản phẩm');
                                const price = p?.price ?? detail.unitPrice;
                                const image = p?.imageUrls?.[0] || detail.productImage || 'https://via.placeholder.com/120x90?text=No+Image';
                                const description = p?.description || detail.productDescription;
                                const subtotal = (price || 0) * detail.quantity;
                                return (
                                    <div key={detail.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
                                        <input type="checkbox" className="w-5 h-5" checked={selectedIds.has(detail.id)} onChange={() => toggleOne(detail.id)} />
                                        <img src={image} alt={title} className="w-24 h-20 object-cover rounded-lg border" />
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-800 line-clamp-2">{title}</div>
                                            <div className="text-amber-600 font-bold mt-1">{(price || 0).toLocaleString('vi-VN')} ₫</div>
                                            {description && (
                                                <div className="text-sm text-gray-600 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: description.length > 120 ? `${description.substring(0, 120)}...` : description }} />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => updateQuantity(detail.id, Math.max(1, detail.quantity - 1))} className="w-8 h-8 border rounded">-</button>
                                            <span className="w-10 text-center">{detail.quantity}</span>
                                            <button onClick={() => updateQuantity(detail.id, detail.quantity + 1)} className="w-8 h-8 border rounded">+</button>
                                        </div>
                                        <div className="w-32 text-right font-semibold text-gray-800">{subtotal.toLocaleString('vi-VN')} ₫</div>
                                        <button onClick={() => removeDetail(detail.id, title)} className="text-red-500 hover:text-red-600 ml-2">Xóa</button>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="lg:col-span-4">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Tạm tính (đã chọn)</span>
                                    <span className="font-semibold">{selectedTotal.toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-gray-600">Sản phẩm đã chọn</span>
                                    <span className="font-semibold">{selectedProductsCount}</span>
                                </div>
                                <hr className="my-4" />
                                <div className="flex items-center justify-between text-lg font-bold">
                                    <span>Tổng</span>
                                    <span className="text-amber-600">{selectedTotal.toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <button onClick={handleCheckout} className="w-full mt-4 bg-gray-900 hover:bg-amber-600 text-white rounded-lg py-3 font-semibold" disabled={selectedIds.size === 0}>Tạo đơn hàng</button>
                                <div className="text-xs text-gray-400 mt-2">(Tổng số lượng đã chọn: {selectedQuantityTotal})</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default CartPage