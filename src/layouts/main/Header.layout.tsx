import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import SearchComponent from '../../components/common/Search.com';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserInfo, useAuth } from '../../hooks';
import { UserRole } from '../../app/enums';
import { ROUTER_URL } from '../../consts/router.path.const';
import { useCartStore } from '@hooks/modules/useCartStore';

// Mapping helpers for role-specific paths
const getProfilePath = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN:
            return ROUTER_URL.ADMIN.SETTINGS;
        case UserRole.BUYER:
            return ROUTER_URL.BUYER.PROFILE;
        case UserRole.SELLER:
            return ROUTER_URL.SELLER.PROFILE;
        case UserRole.SHIPPER:
            return ROUTER_URL.SHIPPER.PROFILE;
        default:
            return '/';
    }
};

const getOrdersPath = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN:
            return ROUTER_URL.ADMIN.ORDERS;
        case UserRole.BUYER:
            return ROUTER_URL.BUYER.ORDERS;
        case UserRole.SELLER:
            return ROUTER_URL.SELLER.ORDERS;
        case UserRole.SHIPPER:
            return ROUTER_URL.SHIPPER.DELIVERY_ORDERS;
        default:
            return '/';
    }
};

const getDashboardPath = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN:
            return ROUTER_URL.ADMIN.BASE;
        case UserRole.BUYER:
            return ROUTER_URL.BUYER.BASE;
        case UserRole.SELLER:
            return ROUTER_URL.SELLER.BASE;
        case UserRole.SHIPPER:
            return ROUTER_URL.SHIPPER.BASE;
        default:
            return '/';
    }
};

// Role-specific menu items
const getRoleSpecificMenuItems = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN:
            return [
                { label: 'Quản lý người dùng', path: ROUTER_URL.ADMIN.USERS, icon: '👥' },
                { label: 'Quản lý sản phẩm', path: ROUTER_URL.ADMIN.PRODUCTS, icon: '📦' },
                { label: 'Quản lý danh mục', path: ROUTER_URL.ADMIN.CATEGORIES, icon: '📋' },
                { label: 'Báo cáo', path: ROUTER_URL.ADMIN.REPORTS, icon: '📊' },
                { label: 'Thống kê', path: ROUTER_URL.ADMIN.STATISTICS, icon: '📈' }
            ];
        case UserRole.BUYER:
            return [
                { label: 'Giỏ hàng', path: ROUTER_URL.BUYER.CART, icon: '🛒' },
                { label: 'Yêu thích', path: ROUTER_URL.CLIENT.FAVORITE, icon: '❤️' },
                { label: 'Lịch sử đơn hàng', path: ROUTER_URL.BUYER.ORDER_HISTORY, icon: '📜' },
                { label: 'Ví tiền', path: ROUTER_URL.BUYER.WALLET, icon: '💰' },
                { label: 'Thông báo', path: ROUTER_URL.BUYER.NOTIFICATIONS, icon: '🔔' }
            ];
        case UserRole.SELLER:
            return [
                { label: 'Sản phẩm', path: ROUTER_URL.SELLER.PRODUCTS, icon: '🏍️' },
                { label: 'Thêm sản phẩm', path: ROUTER_URL.SELLER.ADD_PRODUCT, icon: '➕' },
                { label: 'Cửa hàng', path: ROUTER_URL.SELLER.SHOP, icon: '🏪' },
                { label: 'Thống kê bán hàng', path: ROUTER_URL.SELLER.ANALYTICS, icon: '📈' },
                { label: 'Ví & Thu nhập', path: ROUTER_URL.SELLER.WALLET, icon: '💰' },
                { label: 'Đánh giá', path: ROUTER_URL.SELLER.REVIEWS, icon: '⭐' }
            ];
        case UserRole.SHIPPER:
            return [
                { label: 'Đơn giao hàng', path: ROUTER_URL.SHIPPER.DELIVERY_ORDERS, icon: '📦' },
                { label: 'Đang giao', path: ROUTER_URL.SHIPPER.ACTIVE_DELIVERIES, icon: '🚛' },
                { label: 'Lịch sử giao hàng', path: ROUTER_URL.SHIPPER.DELIVERY_HISTORY, icon: '📜' },
                { label: 'Lập tuyến đường', path: ROUTER_URL.SHIPPER.ROUTE_PLANNING, icon: '🗺️' },
                { label: 'Thu nhập', path: ROUTER_URL.SHIPPER.EARNINGS, icon: '💰' },
                { label: 'Hiệu suất', path: ROUTER_URL.SHIPPER.PERFORMANCE, icon: '📊' }
            ];
        default:
            return [];
    }
};

const HeaderLayout: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const user = useUserInfo();
    const { logout } = useAuth();
    const loadCart = useCartStore(s => s.loadCart);

    const handleLogoutClick = () => {
        try {
            logout.mutate();
            setUserMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // Effect để xác định vị trí scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Đóng mobile menu khi thay đổi đường dẫn
    useEffect(() => {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
    }, [location]);

    // Load cart count for badge when user available
    useEffect(() => {
        if (user?.id) loadCart(user.id);
    }, [user?.id]);

    // Định nghĩa các menu item
    const menuItems = [
        { path: '/', label: 'Trang chủ' },
        { path: '/mua-xe', label: 'Mua xe' },
        { path: '/ban-xe', label: 'Bán xe' },
        { path: '/phu-kien', label: 'Phụ kiện' },
        { path: '/tin-tuc', label: 'Tin tức' }
    ];

    // User profile component for reuse
    const UserProfileComponent = ({ mobile = false }) => (
        <>
            {user ? (
                <div className="relative">
                    <motion.div
                        className={`flex items-center ${mobile ? 'justify-center mt-4' : 'ml-4'} cursor-pointer`}
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        whileHover={{ scale: 1.05 }}
                    >
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt="avatar"
                                className={`${mobile ? 'w-12 h-12' : 'w-8 h-8'} rounded-full border-2 border-amber-400 object-cover`}
                            />
                        ) : (
                            <div
                                className={`${mobile ? 'w-12 h-12' : 'w-8 h-8'} rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-bold`}>
                                {user.name?.[0] || user.email?.[0]}
                            </div>
                        )}
                        <div className={mobile ? "text-center mt-2" : "hidden md:block ml-2"}>
                            <div className="font-semibold text-sm text-white truncate max-w-[120px]">{user.name}</div>
                            <div className="text-xs text-gray-300 truncate max-w-[120px]">{user.email}</div>
                        </div>
                        {!mobile && (
                            <motion.div
                                animate={{ rotate: userMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="ml-1 text-gray-400"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Dropdown Menu - only show if not mobile or if mobile and userMenuOpen */}
                    <AnimatePresence>
                        {userMenuOpen && (!mobile || (mobile && userMenuOpen)) && (
                            <motion.div
                                className={`${mobile ? 'relative mt-2' : 'absolute right-0 mt-2 w-56'} bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* User Info Section */}
                                <div className="p-3 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
                                    <div className="text-xs text-gray-400">Đăng nhập với tư cách</div>
                                    <div className="font-semibold text-amber-400 capitalize">{user.role}</div>
                                </div>

                                {/* Dashboard Link */}
                                <Link
                                    to={getDashboardPath(user.role as UserRole)}
                                    className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-amber-400 transition-colors border-b border-gray-700/50"
                                >
                                    <span className="mr-3">🏠</span>
                                    <span className="font-medium">Dashboard</span>
                                </Link>

                                {/* Role-specific menu items - disabled scrollbar */}
                                <div className="max-h-50 overflow-y-auto">
                                    {getRoleSpecificMenuItems(user.role as UserRole).slice(0, 6).map((item, index) => (
                                        <Link
                                            key={index}
                                            to={item.path}
                                            className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            <span className="mr-3 text-base">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>

                                {/* Divider */}
                                <hr className="border-gray-700" />

                                {/* Common Links */}
                                <Link to={getProfilePath(user.role as UserRole)}
                                    className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                    <span className="mr-3">👤</span>
                                    <span>Hồ sơ cá nhân</span>
                                </Link>
                                <Link to={getOrdersPath(user.role as UserRole)}
                                    className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                    <span className="mr-3">📋</span>
                                    <span>Đơn hàng của tôi</span>
                                </Link>

                                {/* Admin specific link */}
                                {user.role === UserRole.ADMIN && (
                                    <Link to={ROUTER_URL.ADMIN.BASE}
                                        className="flex items-center px-4 py-2.5 text-sm text-purple-400 hover:bg-gray-700 hover:text-purple-300 transition-colors border-t border-gray-700">
                                        <span className="mr-3">⚡</span>
                                        <span className="font-medium">Admin Panel</span>
                                    </Link>
                                )}

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors border-t border-gray-700"
                                >
                                    <span className="mr-3">🚪</span>
                                    <span>Đăng xuất</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <div className={`flex ${mobile ? 'flex-col space-y-3 mt-6' : 'flex-row space-x-3'}`}>
                    <motion.button
                        className={`${mobile ? 'w-full py-3 px-6 font-bold text-gray-900 bg-amber-400 rounded-full' : 'hidden md:block px-4 py-2 text-amber-400 border border-amber-400 rounded-md font-bold overflow-hidden relative group'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {!mobile && (
                            <span
                                className="absolute inset-0 w-full h-full bg-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                        )}
                        <span
                            className={`${mobile ? '' : 'relative z-10 group-hover:text-gray-900 transition-colors duration-300'}`}>
                            <Link to={ROUTER_URL.AUTH.LOGIN}>Đăng nhập</Link>
                        </span>
                    </motion.button>

                    <motion.button
                        className={`${mobile ? 'w-full py-3 px-6 font-bold text-amber-400 border border-amber-400 rounded-full' : 'px-5 py-2 font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-gray-900 rounded-md shadow-lg relative overflow-hidden group'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {!mobile && (
                            <span
                                className="absolute inset-0 w-0 h-full bg-white/20 transform skew-x-10 transition-all duration-500 ease-out origin-left group-hover:w-full"></span>
                        )}
                        <span className="relative z-10">
                            <Link to={ROUTER_URL.AUTH.LOGIN}>Đăng ký</Link>
                        </span>
                    </motion.button>
                </div>
            )}
        </>
    );

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-gray-900/95 backdrop-blur-md shadow-xl'
                : 'bg-gradient-to-r from-gray-900 to-gray-800'
                }`}
        >
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/" className="flex items-center">
                            <motion.img
                                src={logo}
                                alt="Logo"
                                className={`h-12 mr-5 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] rounded-md border-2 border-amber-400 p-1 ${isScrolled ? 'animate-none' : 'animate-pulse'
                                    }`}
                                whileHover={{
                                    scale: 1.15,
                                    rotate: 5,
                                    transition: { duration: 0.3 }
                                }}
                                whileTap={{ scale: 0.95 }}
                            />
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <motion.nav
                        className="hidden md:flex items-center space-x-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={item.path}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                            >
                                <Link
                                    to={item.path}
                                    className={`relative text-gray-100 font-bold text-sm uppercase tracking-wider transition-colors duration-300 py-1 group overflow-hidden`}
                                >
                                    <span className="relative z-10">{item.label}</span>
                                    <motion.span
                                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-md transform origin-left ${location.pathname === item.path ? 'scale-x-110' : 'scale-x-0'
                                            }`}
                                        initial={false}
                                        animate={{ scaleX: location.pathname === item.path ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <span
                                        className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-md transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                    <span
                                        className="absolute inset-0 w-full h-full bg-amber-400/10 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></span>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.nav>

                    {/* Search and User Info for Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        <SearchComponent />

                        {/* Cart Icon */}
                        <CartIcon />

                        {/* User Info for Desktop */}
                        <UserProfileComponent />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <SearchComponent />
                        <CartIcon />
                        <motion.button
                            className="text-amber-400 ml-4"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <motion.path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                    initial={false}
                                    animate={{ d: mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16" }}
                                    transition={{ duration: 0.3 }}
                                />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center z-40"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* User Info for Mobile */}
                        <UserProfileComponent mobile={true} />

                        {/* Mobile Navigation */}
                        <nav className="flex flex-col items-center space-y-6 my-8">
                            {menuItems.map((item, index) => (
                                <motion.div
                                    key={item.path}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                >
                                    <Link
                                        to={item.path}
                                        className={`text-2xl font-bold ${location.pathname === item.path ? 'text-amber-400' : 'text-white hover:text-amber-400'}`}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default HeaderLayout;

// Inline CartIcon component
const CartIcon: React.FC = () => {
    const itemCount = useCartStore(s => s.itemCount);
    return (
        <Link to={ROUTER_URL.CLIENT.CART} className="relative ml-2" title={`Số mặt hàng trong giỏ: ${itemCount || 0}`}>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-gray-900 transition">
                🛒
            </span>
            <span className="absolute -top-1 -right-1 text-[10px] bg-amber-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{itemCount || 0}</span>
        </Link>
    )
}