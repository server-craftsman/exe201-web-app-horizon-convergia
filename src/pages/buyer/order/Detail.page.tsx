import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { OrderService } from '@services/order/order.service';
import { ROUTER_URL } from '@consts/router.path.const';
import { OrderStatus } from '@app/enums/order.enum';
import { useProduct } from '@hooks/modules/useProduct';
import { useUserInfo } from '@hooks/index';

const Detail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const user = useUserInfo();
    const { useProductsByIds } = useProduct();

    const { data, isLoading } = useQuery({
        queryKey: ['orders', 'detail', id],
        queryFn: () => OrderService.getById(id || ''),
        enabled: !!id,
        select: (resp) => (resp as any)?.data,
    });

    const productIds = React.useMemo(() => {
        const details = (data as any)?.orderDetails || [];
        return details.map((d: any) => d.productId).filter(Boolean);
    }, [data]);

    const { data: productMap } = useProductsByIds(productIds);

    const getStatusText = (status: number) => {
        switch (status) {
            case OrderStatus.Pending: return 'Chờ xác nhận';
            case OrderStatus.Confirmed: return 'Đã xác nhận';
            case OrderStatus.Processing: return 'Đang xử lý';
            case OrderStatus.Shipping: return 'Đang giao';
            case OrderStatus.Delivered: return 'Đã giao';
            case OrderStatus.Cancelled: return 'Đã hủy';
            case OrderStatus.Returned: return 'Đã trả';
            case OrderStatus.Refunded: return 'Đã hoàn tiền';
            default: return 'Không xác định';
        }
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case OrderStatus.Pending: return 'bg-yellow-100 text-yellow-800';
            case OrderStatus.Confirmed: return 'bg-blue-100 text-blue-800';
            case OrderStatus.Processing: return 'bg-purple-100 text-purple-800';
            case OrderStatus.Shipping: return 'bg-orange-100 text-orange-800';
            case OrderStatus.Delivered: return 'bg-green-100 text-green-800';
            case OrderStatus.Cancelled: return 'bg-red-100 text-red-800';
            case OrderStatus.Returned: return 'bg-gray-100 text-gray-800';
            case OrderStatus.Refunded: return 'bg-teal-100 text-teal-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                    <Link to={ROUTER_URL.BUYER.ORDER_HISTORY} className="text-amber-600 hover:text-amber-700 text-sm font-medium">Về danh sách</Link>
                </div>
                {isLoading || !data ? (
                    <div className="text-center py-12 text-gray-500">Đang tải...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left: Order info and products */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-500">Mã đơn:</span> <b>{(data as any).orderNo}</b></div>
                                    <div><span className="text-gray-500">Ngày tạo:</span> <b>{new Date((data as any).createdAt).toLocaleString('vi-VN')}</b></div>
                                    <div>
                                        <span className="text-gray-500">Trạng thái:</span>
                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor((data as any).status)}`}>{getStatusText((data as any).status)}</span>
                                    </div>
                                    <div><span className="text-gray-500">Tổng tiền:</span> <b className="text-amber-600">{((data as any).totalPrice || 0).toLocaleString('vi-VN')} ₫</b></div>
                                    <div><span className="text-gray-500">Giảm giá:</span> <b className="text-green-600">{((data as any).discount || 0).toLocaleString('vi-VN')} ₫</b></div>
                                    <div className="md:col-span-2"><span className="text-gray-500">Địa chỉ:</span> <span>{(data as any).shippingAddress}</span></div>
                                </div>

                                <h2 className="mt-6 text-lg font-semibold text-gray-800">Sản phẩm</h2>
                                <div className="mt-2 divide-y">
                                    {(((data as any).orderDetails) || []).map((detail: any, index: number) => {
                                        const p = productMap?.[detail.productId];
                                        const img = p?.imageUrls?.[0] || 'https://via.placeholder.com/80x80?text=No+Image';
                                        const title = p ? `${p.brand || ''} ${p.model || ''}`.trim() : (detail.productType || 'Sản phẩm');
                                        const price = detail.price || p?.price || 0;
                                        return (
                                            <div key={detail.productId || index} className="py-3 flex items-center gap-4">
                                                <img src={img} alt={title} className="w-16 h-16 rounded-lg object-cover border" onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=No+Image'; }} />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-800 line-clamp-2">
                                                        <Link to={ROUTER_URL.CLIENT.PRODUCT_DETAIL.replace(':id', detail.productId)} className="hover:text-amber-600">{title}</Link>
                                                    </div>
                                                    <div className="text-sm text-gray-500">ID: {detail.productId}</div>
                                                    {detail.discount > 0 && (
                                                        <div className="text-sm text-green-600">Giảm giá: {detail.discount.toLocaleString('vi-VN')} ₫</div>
                                                    )}
                                                </div>
                                                <div className="text-right font-semibold text-gray-800 min-w-[120px]">{price.toLocaleString('vi-VN')} ₫</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right: Customer info */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin khách hàng</h3>
                                <div className="space-y-2 text-sm">
                                    <div><span className="text-gray-500">Họ tên:</span> <b>{user?.name || '—'}</b></div>
                                    <div><span className="text-gray-500">Email:</span> <b>{user?.email || '—'}</b></div>
                                    <div><span className="text-gray-500">Số điện thoại:</span> <b>{(user as any)?.phoneNumber || '—'}</b></div>
                                    <div><span className="text-gray-500">Địa chỉ:</span> <b>{user?.address || (data as any)?.shippingAddress || '—'}</b></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Detail;