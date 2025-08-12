import React from 'react';
import { Link } from 'react-router-dom';
import { useUserInfo } from '@hooks/index';
import { OrderService } from '@services/order/order.service';
import { useQuery } from '@tanstack/react-query';
import { ROUTER_URL } from '@consts/router.path.const';

const History: React.FC = () => {
    const user = useUserInfo();
    const { data, isLoading } = useQuery({
        queryKey: ['orders', 'history', user?.id],
        queryFn: () => OrderService.search({ buyerId: user?.id || '', page: 1, pageSize: 20 }),
        enabled: !!user?.id,
        select: (resp) => (resp as any)?.data,
        staleTime: 60_000,
    });

    if (!user?.id) return <div className="container mx-auto px-4 py-12 text-center text-gray-600">Vui lòng đăng nhập để xem đơn hàng</div>;

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Đơn hàng của bạn</h1>
                    <Link to={ROUTER_URL.COMMON.HOME} className="text-amber-600 hover:text-amber-700 text-sm font-medium">Trang chủ</Link>
                </div>
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">Đang tải...</div>
                ) : !data || !data.items || data.items.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Chưa có đơn hàng</div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold text-gray-500 border-b">
                            <div className="col-span-4">Sản phẩm</div>
                            <div className="col-span-2">Mã đơn</div>
                            <div className="col-span-2">Tổng tiền</div>
                            <div className="col-span-2">Trạng thái</div>
                            <div className="col-span-2 text-right">Hành động</div>
                        </div>
                        {data.items.map((o: any) => (
                            <div key={o.id} className="grid grid-cols-12 px-4 py-3 border-b last:border-b-0 items-center">
                                <div className="col-span-4 text-sm text-gray-800 truncate">{o.items?.map((i: any) => i.productName).join(', ')}</div>
                                <div className="col-span-2 text-sm text-gray-600 truncate">{o.code || o.id}</div>
                                <div className="col-span-2 text-sm font-semibold text-gray-800">{(o.total || 0).toLocaleString('vi-VN')} ₫</div>
                                <div className="col-span-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 inline-block">{o.status}</div>
                                <div className="col-span-2 text-right">
                                    <Link to={ROUTER_URL.BUYER.ORDER_DETAIL.replace(':id', o.id)} className="text-amber-600 hover:text-amber-700 text-sm font-medium">Xem chi tiết</Link>
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