import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OrderService } from '@services/order/order.service';
import { ROUTER_URL } from '@consts/router.path.const';
import { Link } from 'react-router-dom';

const inputCls = 'w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400';
const selectCls = inputCls;
const buttonPrimary = 'inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-gray-900 rounded-lg px-4 py-2 font-medium shadow-sm';

function getOrderStatusInfo(raw: any): { text: string; cls: string } {
    const v = typeof raw === 'number' ? raw : (typeof raw === 'string' ? Number(raw) : Number(raw ?? -1));
    switch (v) {
        case 0: return { text: 'Chờ xử lý', cls: 'bg-gray-700 text-gray-200' };
        case 1: return { text: 'Đã xác nhận', cls: 'bg-blue-700 text-blue-100' };
        case 2: return { text: 'Đang xử lý', cls: 'bg-indigo-700 text-indigo-100' };
        case 3: return { text: 'Đang giao', cls: 'bg-amber-700 text-amber-100' };
        case 4: return { text: 'Đã giao', cls: 'bg-green-700 text-green-100' };
        case 5: return { text: 'Đã hủy', cls: 'bg-red-700 text-red-100' };
        case 6: return { text: 'Đã trả hàng', cls: 'bg-orange-700 text-orange-100' };
        case 7: return { text: 'Đã hoàn tiền', cls: 'bg-emerald-700 text-emerald-100' };
        default: return { text: String(raw ?? 'Không rõ'), cls: 'bg-gray-700 text-gray-200' };
    }
}

const OrderManagementPage: React.FC = () => {
    const [filters, setFilters] = useState({
        buyerId: '',
        sellerId: '',
        status: '' as any,
        page: 1,
        pageSize: 10,
        minTotalPrice: '',
        maxTotalPrice: '',
        fromDate: '',
        toDate: '',
    });

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin', 'orders', filters],
        queryFn: async () => {
            const payload: any = {
                page: filters.page,
                pageSize: filters.pageSize,
            };
            if (filters.buyerId) payload.buyerId = filters.buyerId;
            if (filters.sellerId) payload.sellerId = filters.sellerId;
            if (filters.status !== '' && filters.status !== undefined) payload.status = Number(filters.status);
            if (filters.minTotalPrice) payload.minTotalPrice = Number(filters.minTotalPrice);
            if (filters.maxTotalPrice) payload.maxTotalPrice = Number(filters.maxTotalPrice);
            if (filters.fromDate) payload.fromDate = filters.fromDate;
            if (filters.toDate) payload.toDate = filters.toDate;
            const resp = await OrderService.search(payload);
            const raw = (resp as any)?.data;
            const items = raw?.data?.items || raw?.items || raw?.data || [];
            const totalItems = raw?.data?.totalItems || raw?.totalItems || items.length;
            return { items, totalItems } as { items: any[]; totalItems: number };
        }
    });

    const items = data?.items || [];
    const totalItems = data?.totalItems || 0;
    const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / (filters.pageSize || 10))), [totalItems, filters.pageSize]);

    const setField = (k: string, v: any) => setFilters(prev => ({ ...prev, [k]: v, page: 1 }));

    return (
        <div className="p-6 text-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>

            {/* Filters */}
            <div className="rounded-2xl border border-gray-700 bg-transparent p-4 mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <select value={filters.status} onChange={e => setField('status', e.target.value)} className={selectCls}>
                    <option value="">Trạng thái (tất cả)</option>
                    <option value="0">Chờ xử lý</option>
                    <option value="1">Đã xác nhận</option>
                    <option value="2">Đang xử lý</option>
                    <option value="3">Đang giao</option>
                    <option value="4">Đã giao</option>
                    <option value="5">Đã hủy</option>
                    <option value="6">Đã trả hàng</option>
                    <option value="7">Đã hoàn tiền</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Min total" value={filters.minTotalPrice} onChange={e => setField('minTotalPrice', e.target.value)} className={inputCls} />
                    <input placeholder="Max total" value={filters.maxTotalPrice} onChange={e => setField('maxTotalPrice', e.target.value)} className={inputCls} />
                </div>
                <input type="date" value={filters.fromDate} onChange={e => setField('fromDate', e.target.value)} className={inputCls} />
                <input type="date" value={filters.toDate} onChange={e => setField('toDate', e.target.value)} className={inputCls} />
                <div className="md:col-span-2 lg:col-span-1 flex items-center gap-2">
                    <button onClick={() => refetch()} className={buttonPrimary}>Tìm kiếm</button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-gray-700 bg-transparent overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-800 text-gray-300">
                        <tr>
                            <th className="text-left px-4 py-2">Mã đơn</th>
                            <th className="text-right px-4 py-2">Tổng</th>
                            <th className="text-left px-4 py-2">Trạng thái</th>
                            <th className="text-left px-4 py-2">Ngày tạo</th>
                            <th className="text-right px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-white">
                        {isLoading ? (
                            <tr><td className="px-4 py-6" colSpan={5}>Đang tải...</td></tr>
                        ) : items.length === 0 ? (
                            <tr><td className="px-4 py-6" colSpan={5}>Không có đơn hàng</td></tr>
                        ) : (
                            items.map((o: any) => {
                                const s = getOrderStatusInfo(o?.status ?? o?.orderStatus);
                                return (
                                    <tr key={o?.id} className="border-t border-gray-700">
                                        <td className="px-4 py-2 font-medium">{o?.orderNo || o?.orderCode || o?.code}</td>
                                        <td className="px-4 py-2 text-right">{(o?.totalPrice ?? o?.totalAmount ?? 0).toLocaleString('vi-VN')}₫</td>
                                        <td className="px-4 py-2"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.cls}`}>{s.text}</span></td>
                                        <td className="px-4 py-2">{o?.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : ''}</td>
                                        <td className="px-4 py-2 text-right">
                                            <Link to={ROUTER_URL.ADMIN.ORDER_DETAIL.replace(':id', o?.id)} className="text-amber-400 hover:text-amber-300">Chi tiết</Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-300">
                <div>Trang {filters.page} / {totalPages} • Tổng {totalItems}</div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 border rounded border-gray-600 text-gray-300 hover:bg-gray-800" disabled={filters.page <= 1} onClick={() => setFilters(p => ({ ...p, page: Math.max(1, p.page - 1) }))}>Trước</button>
                    <button className="px-3 py-1 border rounded border-gray-600 text-gray-300 hover:bg-gray-800" disabled={filters.page >= totalPages} onClick={() => setFilters(p => ({ ...p, page: Math.min(totalPages, p.page + 1) }))}>Sau</button>
                </div>
            </div>
        </div>
    );
};

export default OrderManagementPage;