import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTER_URL } from '../../consts/router.path.const';
import { useAuth } from '../../hooks/useAuth';

const SellerHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate(ROUTER_URL.AUTH.LOGIN);
    };

    const sellerNavItems = [
        { name: 'Dashboard', href: ROUTER_URL.SELLER.DASHBOARD, icon: '📊' },
        { name: 'Sản Phẩm', href: ROUTER_URL.SELLER.PRODUCTS, icon: '🏍️' },
        { name: 'Đơn Hàng', href: ROUTER_URL.SELLER.ORDERS, icon: '📦' },
        { name: 'Đánh Giá', href: ROUTER_URL.SELLER.REVIEWS, icon: '⭐' },
        { name: 'Thống Kê', href: ROUTER_URL.SELLER.ANALYTICS, icon: '📈' },
        { name: 'Cửa Hàng', href: ROUTER_URL.SELLER.SHOP, icon: '🏪' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-900/95 via-blue-800/95 to-blue-900/95 backdrop-blur-lg border-b border-blue-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            to={ROUTER_URL.SELLER.DASHBOARD}
                            className="flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">HC</span>
                            </div>
                            <span className="text-blue-400 font-bold text-xl hidden sm:block">
                                Seller Center
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {sellerNavItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-blue-400 hover:bg-blue-800/30 transition-all duration-200 text-sm"
                            >
                                <span>{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">

                        {/* <Link
                            to={ROUTER_URL.SELLER.ADD_PRODUCT}
                            className="hidden sm:flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Thêm SP</span>
                        </Link> */}

                        {/* Notifications */}
                        <Link
                            to={ROUTER_URL.SELLER.NOTIFICATIONS}
                            className="relative p-2 text-gray-300 hover:text-blue-400 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5c-.293-.293-.677-.5-1.121-.5-.444 0-.828.207-1.121.5L15 17zM15 17l-3.5-3.5c-.293-.293-.677-.5-1.121-.5-.444 0-.828.207-1.121.5L9 15l-3.5-3.5C5.207 11.207 4.823 11 4.379 11c-.444 0-.828.207-1.121.5L3 12v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6l-.258-.5" />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                5
                            </span>
                        </Link>

                        {/* Online Status */}
                        <div className="hidden lg:flex items-center space-x-2 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                            <span className="text-emerald-400 text-xs">Online</span>
                            <span className="text-gray-300 text-xs">₫2.5M hôm nay</span>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 p-1 rounded-lg text-gray-300 hover:text-blue-400 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="hidden sm:block text-left">
                                    <div className="text-sm font-medium">{user?.name}</div>
                                    <div className="text-xs text-blue-400">Seller</div>
                                </div>
                                <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Profile Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl z-50">
                                    <div className="py-1">
                                        <Link
                                            to={ROUTER_URL.SELLER.PROFILE}
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-blue-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Hồ Sơ
                                        </Link>
                                        <Link
                                            to={ROUTER_URL.SELLER.SHOP}
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-blue-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            Cửa Hàng
                                        </Link>
                                        <Link
                                            to={ROUTER_URL.SELLER.WALLET}
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-blue-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                            Ví & Thu Nhập
                                        </Link>
                                        <Link
                                            to={ROUTER_URL.SELLER.SETTINGS}
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-blue-400 transition-colors"
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
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-300 hover:text-blue-400 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-blue-700 py-4">
                        {sellerNavItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-blue-400 hover:bg-blue-800/30 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}

                        {/* Mobile Add Product Button */}
                        <Link
                            to={ROUTER_URL.SELLER.ADD_PRODUCT}
                            className="flex items-center space-x-3 px-4 py-3 mx-4 mt-2 bg-green-600 text-white rounded-lg font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Thêm Sản Phẩm</span>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default SellerHeader; 