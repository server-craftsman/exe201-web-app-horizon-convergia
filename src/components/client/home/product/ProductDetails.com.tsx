import React, { useMemo, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProduct } from '@hooks/modules/useProduct'
import { ROUTER_URL } from '@consts/router.path.const'
import { useCartStore } from '@hooks/modules/useCartStore'
import { useUserInfo } from '@hooks/index'
import { ProductService } from '@services/product/product.service'
import { notificationMessage } from '@utils/helper'
import ReviewManagement from './ReviewManagement.com'
import ShareSocialMedia from './ShareSocialMediacom'

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        {children}
    </section>
)

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { useProductById } = useProduct()
    const { data: product, isLoading, error } = useProductById(id || '')
    const { addItem } = useCartStore()
    const user = useUserInfo()

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [dragIndex, setDragIndex] = useState(selectedIndex)

    const productType: 'motor' | 'accessory' | 'spare' = useMemo(() => {
        if (!product) return 'motor'
        if ((product as any).sparePartType) return 'spare'
        if ((product as any).accessoryType) return 'accessory'
        return 'motor'
    }, [product])

    useEffect(() => {
        (async () => {
            try {
                if (!user?.id || !id) { setIsFavorite(false); return; }
                const resp = await ProductService.getFavorites(user.id)
                const list = (resp as any)?.data || []
                setIsFavorite(list.some((p: any) => p.id === id))
            } catch { /* ignore */ }
        })()
    }, [user?.id, id])

    const openChatWithSeller = () => {
        if (!user?.id) { notificationMessage('Vui lòng đăng nhập để chat với người bán', 'warning'); return }
        // In absence of explicit sellerId, try to use product.sellerId
        const receiverId = (product as any)?.sellerId || ''
        if (!receiverId) { notificationMessage('Không tìm thấy người bán để liên hệ', 'error'); return }
        const message = `Xin chào, tôi quan tâm sản phẩm ${product?.brand || ''} ${product?.model || ''}.`;
        const event = new CustomEvent('hc:open-chat', { detail: { senderId: user.id, receiverId, message } })
        window.dispatchEvent(event)
    }

    const toggleFavorite = async () => {
        try {
            if (!user?.id || !product) { notificationMessage('Vui lòng đăng nhập để yêu thích', 'warning'); return; }
            if (isFavorite) {
                await ProductService.removeFavorite(product.id, user.id)
                setIsFavorite(false)
                notificationMessage(`Đã bỏ yêu thích: ${product.brand} ${product.model}`, 'success')
            } else {
                await ProductService.addFavorite(product.id, user.id)
                setIsFavorite(true)
                notificationMessage(`Đã thêm vào yêu thích: ${product.brand} ${product.model}`, 'success')
            }
        } catch (e: any) {
            notificationMessage(e?.message || 'Lỗi thao tác yêu thích', 'error')
        }
    }

    const isNew = (createdAt?: string) => {
        if (!createdAt) return false
        const diffHours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
        return diffHours <= 72
    }

    const shortLocation = (full?: string) => {
        if (!full) return 'Không rõ'
        const parts = full.split(',').map(s => s.trim()).filter(Boolean)
        if (parts.length === 0) return 'Không rõ'
        return parts[parts.length - 1]
    }

    // 360 viewer handlers
    const onDragStart = () => setIsDragging(true)
    const onDragEnd = () => { setIsDragging(false); setSelectedIndex(dragIndex) }
    const onDragMove = (dx: number) => {
        const step = Math.abs(dx) < 5 ? 0 : Math.sign(dx)
        if (step !== 0) {
            const next = (dragIndex + step + (images?.length || 0)) % (images?.length || 1)
            setDragIndex(next)
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-3xl">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/2" />
                        <div className="h-64 bg-gray-200 rounded" />
                        <div className="grid grid-cols-4 gap-3">
                            {[...Array(4)].map((_, i) => (<div key={i} className="h-20 bg-gray-200 rounded" />))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center text-red-600">Không tìm thấy sản phẩm</div>
            </div>
        )
    }

    const images: string[] = (product.imageUrls && product.imageUrls.length ? product.imageUrls : ['https://via.placeholder.com/600x400?text=No+Image'])
    const primaryImage = images[Math.min(selectedIndex, images.length - 1)]
    const moreImages = images

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }} className="mb-6 text-sm text-gray-500">
                    <Link to={ROUTER_URL.COMMON.HOME} className="hover:text-amber-600">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <Link to={productType === 'motor' ? ROUTER_URL.CLIENT.BUY_MOTOR : ROUTER_URL.CLIENT.ACCESSORIES} className="hover:text-amber-600">
                        {productType === 'motor' ? 'Mua xe' : 'Phụ kiện & Phụ tùng'}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-700 font-medium">{product.brand} {product.model}</span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Gallery */}
                    <div className="lg:col-span-7">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
                            <img src={primaryImage} alt={`${product.brand} ${product.model}`} className="w-full h-[440px] object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image' }} />
                            {/* badges */}
                            <div className="absolute top-3 left-3 flex gap-2">
                                {isNew(product.createdAt) && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-amber-500 text-white shadow">Mới đăng</span>
                                )}
                                {product.isVerified && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-emerald-500 text-white shadow">Đã xác minh</span>
                                )}
                                {isFavorite && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-rose-500 text-white shadow">Đã thích</span>
                                )}
                            </div>
                        </motion.div>
                        {/* 360 viewer */}
                        {moreImages.length > 8 && (
                            <div className="mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <div className="px-4 py-2 flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-800">Xoay 360°</div>
                                    <div className="text-xs text-gray-500">Kéo trái/phải để xoay</div>
                                </div>
                                <div
                                    className="relative h-72 select-none cursor-grab active:cursor-grabbing"
                                    onMouseDown={(e) => { onDragStart(); (e.currentTarget as any)._x = e.clientX; setDragIndex(selectedIndex) }}
                                    onMouseUp={onDragEnd}
                                    onMouseLeave={() => isDragging && onDragEnd()}
                                    onMouseMove={(e) => {
                                        if (!isDragging) return
                                        const prev = (e.currentTarget as any)._x || e.clientX
                                        const dx = e.clientX - prev
                                            ; (e.currentTarget as any)._x = e.clientX
                                        onDragMove(Math.sign(dx))
                                    }}
                                >
                                    <img src={moreImages[dragIndex]} alt="360" className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                        {moreImages.length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-3">
                                {moreImages.map((img, idx) => (
                                    <button key={idx} type="button" onClick={() => setSelectedIndex(idx)} className={`relative rounded-lg overflow-hidden border ${idx === selectedIndex ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-200'}`}>
                                        <img src={img} alt={`thumb-${idx}`} className="w-full h-20 object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150x100?text=No+Image' }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-5 lg:sticky lg:top-20 self-start">
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{product.brand} {product.model}</h1>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    {product.year && <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Năm {product.year}</span>}
                                    {product.condition && <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">{product.condition}</span>}
                                    {productType !== 'motor' && (product as any).size && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Size {(product as any).size}</span>
                                    )}
                                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Kho: {product.quantity > 0 ? `${product.quantity}` : 'Hết hàng'}</span>
                                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{shortLocation(product.location)}</span>
                                </div>
                            </div>
                            {/* Share and Favorite buttons on same line */}
                            <div className="flex items-end gap-3 mb-4">
                                <ShareSocialMedia url={window.location.href} title={`${product.brand} ${product.model}`} image={primaryImage} />
                                <button onClick={toggleFavorite} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${isFavorite ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700'}`} title={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M11.645 20.91l-.007-.003-.022-.01a15.247 15.247 0 01-.383-.187 25.18 25.18 0 01-4.244-2.62C4.688 16.182 2.25 13.555 2.25 10.5 2.25 7.462 4.714 5 7.75 5a5.5 5.5 0 013.9 1.64A5.5 5.5 0 0115.55 5c3.036 0 5.5 2.462 5.5 5.5 0 3.055-2.438 5.682-4.739 7.59a25.175 25.175 0 01-4.244 2.62 15.247 15.247 0 01-.383.187l-.022.01-.007.003a.75.75 0 01-.61 0z" />
                                    </svg>
                                    <span className="font-medium">{isFavorite ? 'Đã thích' : 'Yêu thích'}</span>
                                </button>
                            </div>
                            <div className="text-3xl md:text-4xl font-extrabold text-amber-600 mb-1">{product.price.toLocaleString('vi-VN')} ₫</div>
                            <div className="text-sm text-gray-500">Giá đã bao gồm VAT (nếu có)</div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button onClick={openChatWithSeller} className="w-full bg-gray-900 hover:bg-amber-600 text-white rounded-lg py-2 font-medium transition-colors">Liên hệ người bán</button>
                                <button onClick={() => user?.id && addItem(user.id, product.id, 1, `${product.brand} ${product.model}`)} className="w-full border border-gray-300 hover:bg-gray-50 rounded-lg py-2 font-medium">Thêm vào giỏ</button>
                            </div>
                        </motion.div>

                        <div className="mt-4 grid grid-cols-1 gap-4">
                            {/* Có thể thêm block ưu đãi / cam kết tại đây nếu cần */}
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                {id && <ReviewManagement productId={id} className="mt-10" />}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                    <div className="lg:col-span-8 space-y-4">
                        {/* Quick info */}
                        <Section title="Thông tin nhanh">
                            <div className="flex flex-wrap gap-2 text-sm">
                                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">Thương hiệu: <b>{product.brand}</b></span>
                                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">Model: <b>{product.model}</b></span>
                                {product.year && (<span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">Năm: <b>{product.year}</b></span>)}
                                {productType === 'motor' && (product as any).engineCapacity && (<span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">Dung tích: <b>{(product as any).engineCapacity} cc</b></span>)}
                                {productType !== 'motor' && (product as any).size && (<span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">Size: <b>{(product as any).size}</b></span>)}
                                {productType === 'accessory' && (product as any).accessoryType && (<span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">Loại phụ kiện: <b>{(product as any).accessoryType}</b></span>)}
                                {productType === 'spare' && (product as any).sparePartType && (<span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">Loại phụ tùng: <b>{(product as any).sparePartType}</b></span>)}
                                {product.color && (<span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">Màu: <b>{product.color}</b></span>)}
                            </div>
                        </Section>
                        {/* Specifics by type */}
                        {productType === 'motor' && (
                            <>
                                <Section title="Thông số xe máy">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        {((product as any).engineCapacity) && (<div><div className="text-gray-500">Dung tích</div><div className="font-medium">{(product as any).engineCapacity} cc</div></div>)}
                                        {typeof (product as any).mileage === 'number' && (<div><div className="text-gray-500">Số km</div><div className="font-medium">{(product as any).mileage.toLocaleString()} km</div></div>)}
                                        {product.color && (<div><div className="text-gray-500">Màu sắc</div><div className="font-medium">{product.color}</div></div>)}
                                        {((product as any).cylinders) && (<div><div className="text-gray-500">Số xilanh</div><div className="font-medium">{(product as any).cylinders}</div></div>)}
                                        {((product as any).transmission) && (<div><div className="text-gray-500">Hộp số</div><div className="font-medium">{(product as any).transmission}</div></div>)}
                                        {((product as any).fuelType || (product as any).fuel) && (<div><div className="text-gray-500">Nhiên liệu</div><div className="font-medium">{(product as any).fuelType || (product as any).fuel}</div></div>)}
                                    </div>
                                </Section>
                            </>
                        )}

                        {productType === 'accessory' && (
                            <Section title="Thông tin phụ kiện">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    {(product as any).accessoryType && (<div><div className="text-gray-500">Loại phụ kiện</div><div className="font-medium">{(product as any).accessoryType}</div></div>)}
                                    {(product as any).vehicleCompatible && (<div><div className="text-gray-500">Tương thích xe</div><div className="font-medium">{(product as any).vehicleCompatible}</div></div>)}
                                    {product.color && (<div><div className="text-gray-500">Màu sắc</div><div className="font-medium">{product.color}</div></div>)}
                                    {(product as any).size && (<div><div className="text-gray-500">Kích cỡ/Size</div><div className="font-medium">{(product as any).size}</div></div>)}
                                </div>
                            </Section>
                        )}

                        {productType === 'spare' && (
                            <Section title="Thông tin phụ tùng">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    {(product as any).sparePartType && (<div><div className="text-gray-500">Loại phụ tùng</div><div className="font-medium">{(product as any).sparePartType}</div></div>)}
                                    {(product as any).vehicleCompatible && (<div><div className="text-gray-500">Tương thích xe</div><div className="font-medium">{(product as any).vehicleCompatible}</div></div>)}
                                    {product.color && (<div><div className="text-gray-500">Màu sắc</div><div className="font-medium">{product.color}</div></div>)}
                                    {(product as any).size && (<div><div className="text-gray-500">Kích cỡ/Size</div><div className="font-medium">{(product as any).size}</div></div>)}
                                </div>
                            </Section>
                        )}

                        {/* Description */}
                        <Section title="Mô tả chi tiết">
                            <div className="prose max-w-none text-gray-700">
                                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                            </div>
                        </Section>
                    </div>

                    {/* Seller box */}
                    <div className="lg:col-span-4 space-y-4">
                        <Section title="Thông tin người bán">
                            <div className="space-y-2 text-sm">
                                {(product as any).sellerName && (<div><span className="text-gray-500">Người bán:</span> <span className="font-medium">{(product as any).sellerName}</span></div>)}
                                {(product as any).sellerPhone && (<div><span className="text-gray-500">Điện thoại:</span> <a href={`tel:${(product as any).sellerPhone}`} className="font-medium text-amber-700">{(product as any).sellerPhone}</a></div>)}
                                {(product as any).sellerEmail && (<div><span className="text-gray-500">Email:</span> <a href={`mailto:${(product as any).sellerEmail}`} className="font-medium text-amber-700">{(product as any).sellerEmail}</a></div>)}
                                {product.createdAt && (<div><span className="text-gray-500">Đăng lúc:</span> <span className="font-medium">{new Date(product.createdAt).toLocaleString('vi-VN')}</span></div>)}
                            </div>
                        </Section>
                        <Section title="Địa điểm">
                            <div className="text-gray-700">{shortLocation(product.location)}</div>
                        </Section>

                        <Section title="Chính sách & Giao hàng">
                            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                <li>Hỗ trợ kiểm tra hàng khi nhận</li>
                                <li>Đổi trả trong 7 ngày nếu lỗi do nhà sản xuất</li>
                                <li>Miễn phí vận chuyển nội thành (tùy sản phẩm)</li>
                            </ul>
                        </Section>
                    </div>
                </div>

                {/* Mobile sticky CTA */}
                <div className="fixed md:hidden bottom-0 inset-x-0 z-40 bg-white border-t shadow-sm">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
                        <div>
                            <div className="text-xs text-gray-500">Giá</div>
                            <div className="text-lg font-bold text-amber-600">{product.price.toLocaleString('vi-VN')} ₫</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <a href={(product as any).sellerPhone ? `tel:${(product as any).sellerPhone}` : '#'} className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium">Gọi</a>
                            <button onClick={() => user?.id && addItem(user.id, product.id, 1, `${product.brand} ${product.model}`)} className="px-4 py-2 rounded-lg border font-medium">+ Giỏ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails