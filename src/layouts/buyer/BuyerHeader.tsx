import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTER_URL } from '../../consts/router.path.const';
import { useAuth } from '../../hooks/useAuth';

const BuyerHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate(ROUTER_URL.AUTH.LOGIN);
    };

    const buyerNavItems = [
        { name: 'Trang Chủ', href: ROUTER_URL.BUYER.DASHBOARD, icon: '🏠' },
        { name: 'Mua Xe', href: ROUTER_URL.CLIENT.BUY_MOTOR, icon: '🏍️' },
        { name: 'Phụ Kiện', href: ROUTER_URL.CLIENT.ACCESSORIES, icon: '🔧' },
        { name: 'Đơn Hàng', href: ROUTER_URL.BUYER.ORDERS, icon: '📦' },
        { name: 'Yêu Thích', href: ROUTER_URL.BUYER.FAVORITES, icon: '❤️' },
    ];

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="sticky top-0 z-50 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-lg border-b border-gray-700/50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex-shrink-0"
                    >
                        <Link
                            to={ROUTER_URL.BUYER.DASHBOARD}
                            className="flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">HC</span>
                            </div>
                            <span className="text-amber-400 font-bold text-xl hidden sm:block">
                                Horizon Convergia
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-1">
                        {buyerNavItems.map((item, index) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={item.href}
                                    className="group relative px-4 py-2 rounded-lg text-gray-300 hover:text-amber-400 transition-all duration-300"
                                >
                                    <span className="flex items-center space-x-2">
                                        <span className="text-sm">{item.icon}</span>
                                        <span className="font-medium">{item.name}</span>
                                    </span>

                                    {/* Hover Effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-lg opacity-0 group-hover:opacity-100"
                                        layoutId="hoverBackground"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Right Side - Cart, Notifications, Profile */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to={ROUTER_URL.BUYER.CART}
                                className="relative p-2 text-gray-300 hover:text-amber-400 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-3L4 6M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                                </svg>
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                                >
                                    3
                                </motion.span>
                            </Link>
                        </motion.div>

                        {/* Notifications */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to={ROUTER_URL.BUYER.NOTIFICATIONS}
                                className="relative p-2 text-gray-300 hover:text-amber-400 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5c-.293-.293-.677-.5-1.121-.5-.444 0-.828.207-1.121.5L15 17zM15 17l-3.5-3.5c-.293-.293-.677-.5-1.121-.5-.444 0-.828.207-1.121.5L9 15l-3.5-3.5C5.207 11.207 4.823 11 4.379 11c-.444 0-.828.207-1.121.5L3 12v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6l-.258-.5" />
                                </svg>
                                <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                                >
                                    2
                                </motion.span>
                            </Link>
                        </motion.div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 p-2 rounded-lg text-gray-300 hover:text-amber-400 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="hidden sm:block font-medium">{user?.name}</span>
                                <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </motion.button>

                            {/* Profile Dropdown Menu */}
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl z-50"
                                >
                                    <div className="py-1">
                                        <Link
                                            to={ROUTER_URL.BUYER.PROFILE}
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-amber-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Hồ Sơ
                                        </Link>
                                        <Link
                                            to={ROUTER_URL.BUYER.WALLET}
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-amber-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                            Ví Tiền
                                        </Link>
                                        <Link
                                            to={ROUTER_URL.BUYER.SETTINGS}
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-amber-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Cài Đặt
                                        </Link>
                                        <hr className="border-gray-700 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Đăng Xuất
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-300 hover:text-amber-400 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-700 py-4"
                    >
                        {buyerNavItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-amber-400 hover:bg-gray-800/50 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
};

export default BuyerHeader; 