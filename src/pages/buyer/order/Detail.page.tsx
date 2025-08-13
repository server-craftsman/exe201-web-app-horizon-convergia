import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { OrderService } from '@services/order/order.service';

const Detail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useQuery({
        queryKey: ['orders', 'detail', id],
        queryFn: () => OrderService.getById(id || ''),
        enabled: !!id,
        select: (resp) => (resp as any)?.data?.data,
    });

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                    <Link to="../lich-su-don-hang" className="text-amber-600 hover:text-amber-700 text-sm font-medium">Về danh sách</Link>
                </div>
                {isLoading || !data ? (
                    <div className="text-center py-12 text-gray-500">Đang tải...</div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-500">Mã đơn:</span> <b>{data.code || data.id}</b></div>
                            <div><span className="text-gray-500">Ngày tạo:</span> <b>{new Date(data.createdAt).toLocaleString('vi-VN')}</b></div>
                            <div><span className="text-gray-500">Trạng thái:</span> <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{data.status}</span></div>
                            <div><span className="text-gray-500">Tổng tiền:</span> <b className="text-amber-600">{(data.total || 0).toLocaleString('vi-VN')} ₫</b></div>
                            <div className="md:col-span-2"><span className="text-gray-500">Địa chỉ:</span> <span>{data.shippingAddress}</span></div>
                        </div>

                        <h2 className="mt-6 text-lg font-semibold text-gray-800">Sản phẩm</h2>
                        <div className="mt-2 divide-y">
                            {(data.items || []).map((it: any) => (
                                <div key={it.id} className="py-3 flex items-center justify-between">
                                    <div className="flex-1 pr-4">
                                        <div className="font-medium text-gray-800">{it.productName}</div>
                                        <div className="text-sm text-gray-500">SL: {it.quantity}</div>
                                    </div>
                                    <div className="text-right font-semibold text-gray-800">{(it.subtotal || 0).toLocaleString('vi-VN')} ₫</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Detail; 