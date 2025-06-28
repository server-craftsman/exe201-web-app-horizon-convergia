import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTER_URL } from '../../consts/router.path.const';
import { useAuth } from '../../hooks/useAuth';

const ShipperHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navigationItems = [
        { name: 'Trang Chủ', href: ROUTER_URL.SHIPPER.DASHBOARD, icon: '🏠' },
        { name: 'Đơn Mới', href: ROUTER_URL.SHIPPER.DELIVERY_ORDERS, icon: '📦' },
        { name: 'Đang Giao', href: ROUTER_URL.SHIPPER.ACTIVE_DELIVERIES, icon: '🚚' },
        { name: 'Lịch Sử', href: ROUTER_URL.SHIPPER.DELIVERY_HISTORY, icon: '📋' },
        { name: 'Thu Nhập', href: ROUTER_URL.SHIPPER.EARNINGS, icon: '💰' },
    ];

    const handleLogout = () => {
        logout();
        navigate(ROUTER_URL.AUTH.LOGIN);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to={ROUTER_URL.SHIPPER.DASHBOARD} className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">HC</span>
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white">Horizon Convergia</span>
                                <div className="text-xs text-orange-400 font-medium">Shipper Center</div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navigationItems.map((item) => (
                            <motion.div
                                key={item.name}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to={item.href}
                                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Delivery Status */}
                        <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-green-400 text-sm font-medium">Online</span>
                        </div>

                        {/* Today's Earnings */}
                        <div className="flex items-center space-x-2 px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="text-orange-400 text-sm font-medium">450K₫</span>
                        </div>

                        {/* Notifications */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                            >
                                <span className="text-xs text-white font-bold">3</span>
                            </motion.div>
                        </motion.button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                                    </span>
                                </div>
                                <span className="text-sm font-medium hidden lg:block">{user?.name || 'Shipper'}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </motion.button>

                            {/* Profile Dropdown Menu */}
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2"
                                >
                                    <div className="px-4 py-3 border-b border-slate-700">
                                        <p className="text-sm font-medium text-white">{user?.name || 'Shipper'}</p>
                                        <p className="text-xs text-gray-400">{user?.email}</p>
                                        <div className="flex items-center mt-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                            <span className="text-xs text-green-400">Hoạt động</span>
                                        </div>
                                    </div>

                                    <div className="py-1">
                                        <Link
                                            to={ROUTER_URL.SHIPPER.PROFILE}
                                            className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Hồ sơ cá nhân
                                        </Link>
                                        <Link
                                            to={ROUTER_URL.SHIPPER.PERFORMANCE}
                                            className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Hiệu suất
                                        </Link>
                                        <Link
                                            to={ROUTER_URL.SHIPPER.WALLET}
                                            className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Ví & Thu nhập
                                        </Link>
                                        <Link
                                            to={ROUTER_URL.SHIPPER.SETTINGS}
                                            className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Cài đặt
                                        </Link>
                                    </div>

                                    <div className="border-t border-slate-700 pt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Đăng xuất
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden py-4 border-t border-slate-700"
                    >
                        <div className="space-y-2">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}

                            <div className="border-t border-slate-700 pt-2 mt-2">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </nav>
        </header>
    );
};

export default ShipperHeader; 