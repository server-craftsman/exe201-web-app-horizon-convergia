import React from 'react';
import { Link } from 'react-router-dom';
import { useUserInfo } from '@hooks/index';
import { OrderService } from '@services/order/order.service';
import { useQuery } from '@tanstack/react-query';
import { ROUTER_URL } from '@consts/router.path.const';
import { OrderStatus } from '@app/enums/order.enum';

const History: React.FC = () => {
    const user = useUserInfo();
    const { data, isLoading } = useQuery({
        queryKey: ['orders', 'history', user?.id],
        queryFn: () => OrderService.search({ buyerId: user?.id || '', page: 1, pageSize: 20 }),
        enabled: !!user?.id,
        select: (resp) => (resp as any)?.data,
        staleTime: 60_000,
    });

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

    if (!user?.id) return <div className="container mx-auto px-4 py-12 text-center text-gray-600">Vui lòng đăng nhập để xem đơn hàng</div>;

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Đơn hàng của bạn</h1>
                    <Link to={ROUTER_URL.BUYER.BASE} className="text-amber-600 hover:text-amber-700 text-sm font-medium">Trang chủ</Link>
                </div>
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">Đang tải...</div>
                ) : !data || !data.items || data.items.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Chưa có đơn hàng</div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold text-gray-500 border-b">
                            <div className="col-span-3">Mã đơn hàng</div>
                            <div className="col-span-2">Tổng tiền</div>
                            <div className="col-span-3">Địa chỉ giao hàng</div>
                            <div className="col-span-2">Trạng thái</div>
                            <div className="col-span-2 text-right">Hành động</div>
                        </div>
                        {data.items.map((order: any) => (
                            <div key={order.id} className="grid grid-cols-12 px-4 py-3 border-b last:border-b-0 items-center">
                                <div className="col-span-3 text-sm text-gray-800 font-medium">{order.orderNo}</div>
                                <div className="col-span-2 text-sm font-semibold text-gray-800">{(order.totalPrice || 0).toLocaleString('vi-VN')} ₫</div>
                                <div className="col-span-3 text-sm text-gray-600 truncate" title={order.shippingAddress}>{order.shippingAddress}</div>
                                <div className="col-span-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                                <div className="col-span-2 text-right">
                                    <Link to={ROUTER_URL.BUYER.ORDER_DETAIL.replace(':id', order.id)} className="text-amber-600 hover:text-amber-700 text-sm font-medium">Xem chi tiết</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default History; 