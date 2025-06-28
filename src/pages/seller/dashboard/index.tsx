import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTER_URL } from '../../../consts/router.path.const';

const SellerDashboard: React.FC = () => {
    const quickActions = [
        {
            title: 'Thêm Sản Phẩm',
            description: 'Đăng bán sản phẩm mới',
            icon: '➕',
            href: ROUTER_URL.SELLER.ADD_PRODUCT,
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Quản Lý Đơn Hàng',
            description: 'Xử lý đơn hàng mới',
            icon: '📦',
            href: ROUTER_URL.SELLER.ORDERS,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Thống Kê',
            description: 'Phân tích doanh thu',
            icon: '📊',
            href: ROUTER_URL.SELLER.ANALYTICS,
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Cửa Hàng',
            description: 'Quản lý shop của bạn',
            icon: '🏪',
            href: ROUTER_URL.SELLER.SHOP,
            color: 'from-amber-500 to-amber-600',
        },
    ];

    const salesData = [
        { period: 'Hôm nay', value: '2.5M₫', change: '+12%', trend: 'up' },
        { period: 'Tuần này', value: '18.2M₫', change: '+8%', trend: 'up' },
        { period: 'Tháng này', value: '125M₫', change: '+25%', trend: 'up' },
        { period: 'Năm nay', value: '890M₫', change: '+18%', trend: 'up' },
    ];

    const recentOrders = [
        {
            id: '#DH003',
            customer: 'Nguyễn Văn A',
            product: 'Honda Wave Alpha',
            status: 'Chờ xử lý',
            amount: '35,000,000₫',
            date: '2024-01-15',
        },
        {
            id: '#DH004',
            customer: 'Trần Thị B',
            product: 'Yamaha Exciter 155',
            status: 'Đã xác nhận',
            amount: '47,000,000₫',
            date: '2024-01-14',
        },
    ];

    const topProducts = [
        { name: 'Honda Wave Alpha', sales: 25, revenue: '875M₫' },
        { name: 'Yamaha Exciter 155', sales: 18, revenue: '846M₫' },
        { name: 'Honda Air Blade 125', sales: 12, revenue: '540M₫' },
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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Seller Dashboard 📊
                            </h1>
                            <p className="text-gray-400">
                                Quản lý cửa hàng và theo dõi hiệu suất kinh doanh
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-green-400 text-sm font-medium">Shop Online</span>
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

                {/* Sales Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    {salesData.map((data) => (
                        <div
                            key={data.period}
                            className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-400 text-sm">{data.period}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${data.trend === 'up'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {data.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-white">{data.value}</p>
                        </div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Đơn hàng mới</h2>
                            <Link
                                to={ROUTER_URL.SELLER.ORDERS}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
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
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold">📦</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{order.product}</p>
                                            <p className="text-sm text-gray-400">{order.customer} • {order.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-white">{order.amount}</p>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Chờ xử lý'
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : 'bg-green-500/20 text-green-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Top Products */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Sản phẩm bán chạy</h2>
                            <Link
                                to={ROUTER_URL.SELLER.ANALYTICS}
                                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                            >
                                Chi tiết →
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {topProducts.map((product, index) => (
                                <div
                                    key={product.name}
                                    className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">#{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{product.name}</p>
                                            <p className="text-sm text-gray-400">{product.sales} đã bán</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-white">{product.revenue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Performance Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Đánh giá trung bình</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-2xl font-bold text-white">4.8</p>
                                    <div className="flex space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Tổng sản phẩm</p>
                                <p className="text-2xl font-bold text-white">127</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Khách hàng</p>
                                <p className="text-2xl font-bold text-white">2,847</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SellerDashboard; 