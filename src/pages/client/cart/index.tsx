import React, { useEffect } from 'react'
import { useCartStore } from '@hooks/modules/useCartStore'
import { useUserInfo } from '@hooks/index'
import { OrderService } from '@services/order/order.service'
import { PaymentService } from '@services/payment/payment.service'
import { notificationMessage } from '@utils/helper'

const CartPage: React.FC = () => {
    const user = useUserInfo()
    const { cart, isLoading, itemCount, loadCart, updateQuantity, removeDetail } = useCartStore()

    useEffect(() => {
        if (user?.id) loadCart(user.id)
    }, [user?.id])

    if (!user) return <div className="container mx-auto px-4 py-12 text-center text-gray-600">Vui lòng đăng nhập để xem giỏ hàng</div>

    const handleCheckout = async () => {
        try {
            if (!cart || (cart.details || []).length === 0) {
                notificationMessage('Giỏ hàng trống', 'warning');
                return;
            }
            const cartIds = cart.details.map(d => d.id);
            const shippingAddress = user.address || 'Địa chỉ nhận hàng'; // TODO: lấy từ profile/checkout form
            const discount = 0;

            // 1) tạo order từ cart
            const orderResp = await OrderService.createFromCart({ cartId: cartIds, shippingAddress: shippingAddress || '', discount });
            const order = (orderResp as any)?.data?.data;

            if (!order) {
                notificationMessage('Không tạo được đơn hàng', 'error');
                return;
            }

            // 2) khởi tạo thanh toán nhiều đơn (ở đây 1 đơn)
            const paymentResp = await PaymentService.multiPayment({ orderIds: [order.id], paymentMethod: 'payos', description: 'Thanh toán đơn hàng' });
            const paymentUrl = (paymentResp as any)?.data?.data?.paymentUrl || (paymentResp as any)?.data?.data?.redirectUrl;

            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                notificationMessage('Không lấy được link thanh toán', 'error');
            }
        } catch (e: any) {
            notificationMessage(e?.message || 'Lỗi khi thanh toán', 'error');
        }
    }

    return (
        <section className="py-10 bg-gray-50 min-h-[60vh]">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Giỏ hàng của bạn ({itemCount})</h1>

                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Đang tải giỏ hàng...</div>
                ) : !cart || (cart.details || []).length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Giỏ hàng trống</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 space-y-4">
                            {(cart.details || []).map(detail => (
                                <div key={detail.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
                                    <img src={detail.productImage || 'https://via.placeholder.com/120x90?text=No+Image'} alt={detail.productName || 'item'} className="w-24 h-20 object-cover rounded-lg border" />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800 line-clamp-2">{detail.productName || 'Sản phẩm'}</div>
                                        <div className="text-amber-600 font-bold mt-1">{detail.unitPrice.toLocaleString('vi-VN')} ₫</div>
                                        <div className="text-sm text-gray-500">Mã: {detail.productId}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(detail.id, Math.max(1, detail.quantity - 1))} className="w-8 h-8 border rounded">-</button>
                                        <span className="w-10 text-center">{detail.quantity}</span>
                                        <button onClick={() => updateQuantity(detail.id, detail.quantity + 1)} className="w-8 h-8 border rounded">+</button>
                                    </div>
                                    <div className="w-32 text-right font-semibold text-gray-800">{detail.subtotal.toLocaleString('vi-VN')} ₫</div>
                                    <button onClick={() => removeDetail(detail.id, detail.productName)} className="text-red-500 hover:text-red-600 ml-2">Xóa</button>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-4">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Tạm tính</span>
                                    <span className="font-semibold">{cart.totalPrice.toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-gray-600">Số lượng</span>
                                    <span className="font-semibold">{cart.totalQuantity}</span>
                                </div>
                                <hr className="my-4" />
                                <div className="flex items-center justify-between text-lg font-bold">
                                    <span>Tổng</span>
                                    <span className="text-amber-600">{cart.totalPrice.toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <button onClick={handleCheckout} className="w-full mt-4 bg-gray-900 hover:bg-amber-600 text-white rounded-lg py-3 font-semibold">Thanh toán</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default CartPage