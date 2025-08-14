import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTER_URL } from '../../../consts/router.path.const';
import { useUserInfo } from '../../../hooks';
import { useQuery } from '@tanstack/react-query';
import { OrderService } from '@services/order/order.service';

const BuyerDashboard: React.FC = () => {
    const user = useUserInfo();

    const { data: orderData, isLoading } = useQuery({
        queryKey: ['buyer', 'orders', user?.id],
        enabled: !!user?.id,
        queryFn: async () => {
            const resp = await OrderService.search({ buyerId: user!.id, page: 1, pageSize: 10 });
            console.log('Order response:', resp); // Debug log
            const raw = (resp as any)?.data;
            console.log('Raw data:', raw); // Debug log
            const list = raw?.items || raw?.data?.items || [];
            const totalRecords = raw?.totalRecords || raw?.data?.totalRecords || list.length;
            console.log('Processed data:', { list: list.length, totalRecords }); // Debug log
            return { list, totalRecords } as { list: any[]; totalRecords: number };
        },
        staleTime: 60 * 1000,
    });

    const recentOrders = (orderData?.list || []).slice(0, 5).map((o: any) => ({
        id: o?.id,
        code: o?.orderNo || o?.orderCode || o?.code || o?.orderNumber || '#',
        amount: (o?.totalPrice ?? o?.total ?? o?.totalAmount ?? o?.amount ?? 0) as number,
        date: o?.createdAt || o?.createdDate || '',
        status: o?.status || o?.orderStatus || 0,
        shippingAddress: o?.shippingAddress || '',
    }));

    const totalOrders = orderData?.totalRecords || 0;

    const getStatusInfo = (status: number | string) => {
        const statusCode = typeof status === 'string' ? parseInt(status) : status;
        switch (statusCode) {
            case 0:
                return {
                    text: 'Chờ thanh toán',
                    color: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30',
                    icon: '⏳',
                    bgGradient: 'from-yellow-500/10 to-orange-500/10'
                };
            case 1:
                return {
                    text: 'Đã thanh toán',
                    color: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30',
                    icon: '✅',
                    bgGradient: 'from-green-500/10 to-emerald-500/10'
                };
            case 2:
                return {
                    text: 'Đang xử lý',
                    color: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30',
                    icon: '🔄',
                    bgGradient: 'from-blue-500/10 to-cyan-500/10'
                };
            case 3:
                return {
                    text: 'Đã giao hàng',
                    color: 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30',
                    icon: '📦',
                    bgGradient: 'from-purple-500/10 to-violet-500/10'
                };
            case 4:
                return {
                    text: 'Đã hủy',
                    color: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30',
                    icon: '❌',
                    bgGradient: 'from-red-500/10 to-pink-500/10'
                };
            default:
                return {
                    text: 'Không xác định',
                    color: 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30',
                    icon: '❓',
                    bgGradient: 'from-gray-500/10 to-slate-500/10'
                };
        }
    };

    const isPaidStatus = (order: any): boolean => {
        const status = order?.status || order?.orderStatus;
        if (typeof status === 'number') return status === 1;
        if (typeof status === 'string') {
            const statusCode = parseInt(status);
            return statusCode === 1;
        }
        return false;
    };

    const coalesceAmount = (order: any): number => Number(order?.totalPrice ?? order?.total ?? order?.totalAmount ?? order?.amount ?? 0);

    const totalSpent = (orderData?.list || [])
        .filter(isPaidStatus)
        .reduce((sum: number, o: any) => sum + coalesceAmount(o), 0);

    const pendingOrders = (orderData?.list || []).filter((o: any) => (o?.status || 0) === 0).length;

    const quickActions = [
        {
            title: 'Mua Xe Máy',
            description: 'Khám phá xe máy chất lượng',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            href: ROUTER_URL.CLIENT.BUY_MOTOR,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Phụ Kiện',
            description: 'Phụ kiện và đồ chơi xe máy',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
            ),
            href: ROUTER_URL.CLIENT.ACCESSORIES,
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Đơn Hàng',
            description: 'Theo dõi tình trạng đơn hàng',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            href: ROUTER_URL.BUYER.ORDER_HISTORY,
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Yêu Thích',
            description: 'Sản phẩm bạn đã lưu',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            href: ROUTER_URL.CLIENT.FAVORITE,
            color: 'from-red-500 to-red-600',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Chào mừng trở lại! 👋
                    </h1>
                    <p className="text-gray-400">
                        Khám phá thế giới xe máy tuyệt vời cùng Horizon Convergia
                    </p>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to={action.href}
                                className={`block p-6 bg-gradient-to-br ${action.color} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                            >
                                <div className="text-white mb-3">{action.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                                <p className="text-gray-100 text-sm">{action.description}</p>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <motion.div
                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Tổng đơn hàng</p>
                                <p className="text-3xl font-bold text-white">{isLoading ? '…' : totalOrders}</p>
                                <p className="text-xs text-gray-500 mt-1">Tất cả đơn hàng</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Tổng chi tiêu</p>
                                <p className="text-3xl font-bold text-white">{isLoading ? '…' : `${totalSpent.toLocaleString('vi-VN')}₫`}</p>
                                <p className="text-xs text-gray-500 mt-1">Đơn đã thanh toán</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-xl flex items-center justify-center border border-green-500/20">
                                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Chờ thanh toán</p>
                                <p className="text-3xl font-bold text-white">{isLoading ? '…' : pendingOrders}</p>
                                <p className="text-xs text-gray-500 mt-1">Đơn hàng đang chờ</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl flex items-center justify-center border border-yellow-500/20">
                                <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Đơn hàng gần đây</h2>
                            <p className="text-gray-400 text-sm">Theo dõi tình trạng đơn hàng của bạn</p>
                        </div>
                        <Link
                            to={ROUTER_URL.BUYER.ORDER_HISTORY}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg"
                        >
                            Xem tất cả
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                            <span className="ml-3 text-gray-400">Đang tải đơn hàng…</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📦</div>
                                    <p className="text-gray-400 text-lg mb-2">Chưa có đơn hàng nào</p>
                                    <p className="text-gray-500 text-sm">Bắt đầu mua sắm để xem đơn hàng của bạn ở đây</p>
                                </div>
                            ) : (
                                recentOrders.map((order, index) => {
                                    const statusInfo = getStatusInfo(order.status);
                                    return (
                                        <Link
                                            key={order.id || order.code}
                                            to={`${ROUTER_URL.BUYER.ORDER_DETAIL}/${order.id}`}
                                            className="block"
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                className={`relative overflow-hidden bg-gradient-to-r ${statusInfo.bgGradient} backdrop-blur-sm rounded-xl border border-gray-600/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                                            >
                                                {/* Background Pattern */}
                                                <div className="absolute inset-0 opacity-5">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                                                </div>

                                                {/* Hover overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                <div className="relative z-10 flex items-center justify-between">
                                                    <div className="flex items-center space-x-6">
                                                        <div className="relative">
                                                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                                <span className="text-white text-2xl">{statusInfo.icon}</span>
                                                            </div>
                                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center border-2 border-gray-800">
                                                                <span className="text-white text-xs font-bold">{index + 1}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="font-bold text-white text-lg group-hover:text-amber-300 transition-colors duration-300">{order.code}</h3>
                                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                                                                    <span className="text-lg">{statusInfo.icon}</span>
                                                                    {statusInfo.text}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-300 text-sm mb-1">
                                                                📅 {order.date ? new Date(order.date).toLocaleString('vi-VN') : ''}
                                                            </p>
                                                            {order.shippingAddress && (
                                                                <p className="text-gray-400 text-sm truncate max-w-md">
                                                                    📍 {order.shippingAddress}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors duration-300">
                                                            {order.amount.toLocaleString('vi-VN')}₫
                                                        </p>
                                                        <p className="text-xs text-gray-400">Tổng tiền</p>
                                                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium">
                                                                Xem chi tiết
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default BuyerDashboard; 