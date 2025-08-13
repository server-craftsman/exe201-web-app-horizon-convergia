import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { OrderService } from '@services/order/order.service';
import { ROUTER_URL } from '@consts/router.path.const';

function getOrderStatusText(raw: any): string {
    const v = typeof raw === 'number' ? raw : (typeof raw === 'string' ? Number(raw) : Number(raw ?? -1));
    switch (v) {
        case 0: return 'Chờ xử lý';
        case 1: return 'Đã xác nhận';
        case 2: return 'Đang xử lý';
        case 3: return 'Đang giao';
        case 4: return 'Đã giao';
        case 5: return 'Đã hủy';
        case 6: return 'Đã trả hàng';
        case 7: return 'Đã hoàn tiền';
        default: return String(raw ?? 'Không rõ');
    }
}

const AdminOrderDetailPage: React.FC = () => {
    const params = useParams();
    const id = (params as any)?.id as string | undefined;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin', 'order', id],
        enabled: !!id,
        queryFn: async () => {
            const resp = await OrderService.getById(id as string);
            const raw = (resp as any)?.data;
            return raw?.data || raw;
        }
    });

    if (!id) return <div className="p-6 min-h-screen text-white">Thiếu mã đơn hàng</div>;

    if (isLoading) return <div className="p-6 min-h-screen text-white">Đang tải chi tiết đơn hàng…</div>;
    if (isError || !data) return <div className="p-6 min-h-screen text-white">Không tải được chi tiết đơn hàng</div>;

    const order = data || {};
    const items = order?.items || order?.orderItems || [];

    return (
        <div className="p-6 min-h-screen text-white">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
                <Link to={ROUTER_URL.ADMIN.ORDERS} className="text-amber-400 hover:text-amber-300">← Về danh sách</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-xl border border-gray-700 bg-transparent p-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-gray-300">Mã đơn:</span> <b>{order?.orderNo || order?.orderCode || order?.code || id}</b></div>
                            <div><span className="text-gray-300">Trạng thái:</span> <b>{getOrderStatusText(order?.status ?? order?.orderStatus)}</b></div>
                            <div><span className="text-gray-300">Người mua:</span> <b>{order?.buyer?.name || order?.buyerName || '—'}</b></div>
                            <div><span className="text-gray-300">Ngày tạo:</span> <b>{order?.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '—'}</b></div>
                            <div><span className="text-gray-300">Địa chỉ giao:</span> <b>{order?.shippingAddress || '—'}</b></div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-700 bg-transparent p-4">
                        <h3 className="font-semibold mb-3">Sản phẩm</h3>
                        <div className="divide-y divide-gray-700">
                            {items.length === 0 ? (
                                <div className="text-gray-300 text-sm">Không có sản phẩm</div>
                            ) : items.map((it: any, idx: number) => (
                                <div key={idx} className="py-3 flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium">{it?.productName || `${it?.product?.brand || ''} ${it?.product?.model || ''}`.trim() || 'Sản phẩm'}</div>
                                        <div className="text-sm text-gray-300">SL: {it?.quantity} × {(it?.price ?? it?.unitPrice ?? 0).toLocaleString('vi-VN')}₫</div>
                                    </div>
                                    <div className="font-semibold min-w-[120px] text-right">{((it?.price ?? it?.unitPrice ?? 0) * (it?.quantity ?? 0)).toLocaleString('vi-VN')}₫</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="rounded-xl border border-gray-700 bg-transparent p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Tạm tính</span>
                            <span className="font-semibold">{(order?.subtotal ?? order?.subTotal ?? 0).toLocaleString('vi-VN')}₫</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Giảm giá</span>
                            <span className="font-semibold">{(order?.discount ?? 0).toLocaleString('vi-VN')}₫</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Phí vận chuyển</span>
                            <span className="font-semibold">{(order?.shippingFee ?? 0).toLocaleString('vi-VN')}₫</span>
                        </div>
                        <hr className="my-2 border-gray-700" />
                        <div className="flex items-center justify-between text-lg">
                            <span className="font-semibold">Tổng</span>
                            <span className="font-extrabold text-amber-400">{(order?.totalPrice ?? order?.totalAmount ?? order?.total ?? 0).toLocaleString('vi-VN')}₫</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetailPage; 