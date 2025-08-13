import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTER_URL } from '../../../consts/router.path.const';

const BuyerDashboard: React.FC = () => {
    const quickActions = [
        {
            title: 'Mua Xe Máy',
            description: 'Khám phá hàng nghìn xe máy chất lượng',
            icon: '🏍️',
            href: ROUTER_URL.CLIENT.BUY_MOTOR,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Phụ Kiện',
            description: 'Phụ kiện và đồ chơi xe máy',
            icon: '🔧',
            href: ROUTER_URL.CLIENT.ACCESSORIES,
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Đơn Hàng',
            description: 'Theo dõi tình trạng đơn hàng',
            icon: '📦',
            href: ROUTER_URL.BUYER.ORDERS,
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Yêu Thích',
            description: 'Sản phẩm bạn đã lưu',
            icon: '❤️',
            href: ROUTER_URL.BUYER.FAVORITES,
            color: 'from-red-500 to-red-600',
        },
    ];

    const recentOrders = [
        {
            id: '#DH001',
            product: 'Honda Wave Alpha',
            status: 'Đang giao',
            date: '2024-01-15',
            amount: '35,000,000₫',
        },
        {
            id: '#DH002',
            product: 'Yamaha Exciter 155',
            status: 'Đã giao',
            date: '2024-01-10',
            amount: '47,000,000₫',
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
                                <div className="text-4xl mb-3">{action.icon}</div>
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
                    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Tổng đơn hàng</p>
                                <p className="text-2xl font-bold text-white">12</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Tổng chi tiêu</p>
                                <p className="text-2xl font-bold text-white">125M₫</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Yêu thích</p>
                                <p className="text-2xl font-bold text-white">8</p>
                            </div>
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Đơn hàng gần đây</h2>
                        <Link
                            to={ROUTER_URL.BUYER.ORDERS}
                            className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                        >
                            Xem tất cả →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold">🏍️</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{order.product}</p>
                                        <p className="text-sm text-gray-400">{order.id} • {order.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-white">{order.amount}</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Đã giao'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BuyerDashboard; 