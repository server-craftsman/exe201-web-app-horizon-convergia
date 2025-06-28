import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTER_URL } from '../../consts/router.path.const';

const ShipperDashboard: React.FC = () => {
    const quickActions = [
        {
            title: 'Đơn Hàng Mới',
            description: 'Nhận đơn hàng chờ giao',
            icon: '📦',
            href: ROUTER_URL.SHIPPER.DELIVERY_ORDERS,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Đang Giao',
            description: 'Theo dõi đơn đang giao',
            icon: '🚚',
            href: ROUTER_URL.SHIPPER.ACTIVE_DELIVERIES,
            color: 'from-orange-500 to-orange-600',
        },
        {
            title: 'Lịch Sử',
            description: 'Xem đơn đã hoàn thành',
            icon: '📋',
            href: ROUTER_URL.SHIPPER.DELIVERY_HISTORY,
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Thu Nhập',
            description: 'Theo dõi thu nhập',
            icon: '💰',
            href: ROUTER_URL.SHIPPER.EARNINGS,
            color: 'from-purple-500 to-purple-600',
        },
    ];

    const todayStats = [
        { label: 'Đơn hôm nay', value: '12', change: '+3', trend: 'up' },
        { label: 'Thu nhập', value: '450,000₫', change: '+15%', trend: 'up' },
        { label: 'Km đã đi', value: '87 km', change: '+12 km', trend: 'up' },
        { label: 'Đánh giá', value: '4.9', change: '+0.1', trend: 'up' },
    ];

    const pendingOrders = [
        {
            id: '#DH001',
            customer: 'Nguyễn Văn A',
            address: '123 Đường ABC, Quận 1, TP.HCM',
            distance: '2.5 km',
            fee: '25,000₫',
            product: 'Honda Wave Alpha',
            urgent: true,
        },
        {
            id: '#DH002',
            customer: 'Trần Thị B',
            address: '456 Đường XYZ, Quận 3, TP.HCM',
            distance: '4.2 km',
            fee: '35,000₫',
            product: 'Phụ kiện xe máy',
            urgent: false,
        },
    ];

    const currentDeliveries = [
        {
            id: '#DH003',
            customer: 'Lê Văn C',
            address: '789 Đường DEF, Quận 7, TP.HCM',
            progress: 75,
            estimated: '15 phút',
            phone: '0901234567',
        },
        {
            id: '#DH004',
            customer: 'Phạm Thị D',
            address: '321 Đường GHI, Quận 2, TP.HCM',
            progress: 40,
            estimated: '25 phút',
            phone: '0987654321',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Shipper Dashboard 🚚
                            </h1>
                            <p className="text-gray-400">
                                Quản lý giao hàng và theo dõi hiệu suất
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-green-400 text-sm font-medium">Online</span>
                            </div>
                            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-blue-400 text-sm font-medium">GPS Active</span>
                            </div>
                        </div>
                    </div>
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

                {/* Today Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    {todayStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${stat.trend === 'up'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pending Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Đơn hàng mới</h2>
                            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                                {pendingOrders.length} đơn chờ
                            </span>
                        </div>

                        <div className="space-y-4">
                            {pendingOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border border-slate-600/30 rounded-lg p-4 bg-slate-700/30"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">📦</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{order.id}</p>
                                                <p className="text-sm text-gray-400">{order.customer}</p>
                                            </div>
                                        </div>
                                        {order.urgent && (
                                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                                                Gấp
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <p className="text-sm text-gray-300">{order.address}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <p className="text-sm text-gray-300">{order.product}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <span className="text-orange-400 font-medium">{order.distance}</span>
                                            <span className="text-green-400 font-bold">{order.fee}</span>
                                        </div>
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                            Nhận đơn
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Current Deliveries */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Đang giao hàng</h2>
                            <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
                                {currentDeliveries.length} đơn
                            </span>
                        </div>

                        <div className="space-y-4">
                            {currentDeliveries.map((delivery) => (
                                <div
                                    key={delivery.id}
                                    className="border border-slate-600/30 rounded-lg p-4 bg-slate-700/30"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">🚚</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{delivery.id}</p>
                                                <p className="text-sm text-gray-400">{delivery.customer}</p>
                                            </div>
                                        </div>
                                        <span className="text-orange-400 text-sm font-medium">
                                            ETA: {delivery.estimated}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <p className="text-sm text-gray-300">{delivery.address}</p>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${delivery.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-orange-400 font-medium">{delivery.progress}%</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <a
                                            href={`tel:${delivery.phone}`}
                                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span>Gọi khách</span>
                                        </a>
                                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                            Hoàn thành
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Performance Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Tỷ lệ giao thành công</p>
                                <p className="text-2xl font-bold text-white">98.5%</p>
                                <p className="text-green-400 text-sm">+2.1% so với tháng trước</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Thời gian giao TB</p>
                                <p className="text-2xl font-bold text-white">28 phút</p>
                                <p className="text-orange-400 text-sm">-3 phút so với tuần trước</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Thu nhập tháng này</p>
                                <p className="text-2xl font-bold text-white">12.5M₫</p>
                                <p className="text-purple-400 text-sm">+18% so với tháng trước</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ShipperDashboard; 