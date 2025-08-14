import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserInfo } from '@hooks/index';
import { OrderService } from '@services/order/order.service';
import { useQuery } from '@tanstack/react-query';
import { ROUTER_URL } from '@consts/router.path.const';
import { OrderStatus } from '@app/enums/order.enum';

const History: React.FC = () => {
    const user = useUserInfo();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data, isLoading } = useQuery({
        queryKey: ['orders', 'history', user?.id, currentPage, pageSize],
        queryFn: () => OrderService.search({
            buyerId: user?.id || '',
            page: currentPage,
            pageSize: pageSize
        }),
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

    const totalPages = data?.totalRecords ? Math.ceil(data.totalRecords / pageSize) : 0;
    const totalRecords = data?.totalRecords || 0;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        );

        // First page
        if (startPage > 1) {
            pages.push(
                <button
                    key="1"
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(
                    <span key="ellipsis1" className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300">
                        ...
                    </span>
                );
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 text-sm font-medium border ${currentPage === i
                        ? 'text-white bg-amber-600 border-amber-600'
                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="ellipsis2" className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300">
                        ...
                    </span>
                );
            }
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        );

        return pages;
    };

    if (!user?.id) return <div className="container mx-auto px-4 py-12 text-center text-gray-600">Vui lòng đăng nhập để xem đơn hàng</div>;

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Đơn hàng của bạn</h1>
                    <Link to={ROUTER_URL.BUYER.BASE} className="text-amber-600 hover:text-amber-700 text-sm font-medium">Trang chủ</Link>
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Hiển thị:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-gray-600">đơn hàng mỗi trang</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalRecords)} của {totalRecords} đơn hàng
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">Đang tải...</div>
                ) : !data || !data.items || data.items.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Chưa có đơn hàng</div>
                ) : (
                    <>
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center mt-6">
                                <div className="flex items-center space-x-1">
                                    {renderPagination()}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default History; 