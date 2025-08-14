import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTER_URL } from '../../consts/router.path.const';
import { useAuth } from '../../hooks/useAuth';
import { useCartStore } from '@hooks/modules/useCartStore';
import { useUserInfo } from '../../hooks';

const BuyerHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();
    const user = useUserInfo();
    const itemCount = useCartStore(s => s.itemCount);

    const handleLogout = () => {
        try {
            const lg: any = (auth as any)?.logout;
            if (typeof lg?.mutate === 'function') lg.mutate();
            else if (typeof lg === 'function') lg();
        } finally {
            navigate(ROUTER_URL.AUTH.LOGIN);
        }
    };

    const buyerNavItems = [
        { name: 'Trang chủ', href: ROUTER_URL.BUYER.BASE },
        // { name: 'Mua xe', href: ROUTER_URL.CLIENT.BUY_MOTOR },
        // { name: 'Phụ kiện', href: ROUTER_URL.CLIENT.ACCESSORIES },
        { name: 'Đơn hàng', href: ROUTER_URL.BUYER.ORDER_HISTORY },
        { name: 'Yêu thích', href: ROUTER_URL.BUYER.FAVORITE },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link to={ROUTER_URL.COMMON.HOME} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-white font-bold text-sm">HC</div>
                        <span className="hidden sm:block font-semibold text-gray-800">Horizon Convergia</span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-4">
                    {buyerNavItems.map(item => (
                        <Link key={item.name} to={item.href} className="px-2 py-1 rounded text-sm text-gray-600 hover:text-amber-600 hover:bg-amber-50">
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Right */}
                <div className="flex items-center gap-4">
                    <Link to={ROUTER_URL.CLIENT.CART} className="relative text-gray-600 hover:text-amber-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-3L4 6M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" /></svg>
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">{itemCount}</span>
                        )}
                    </Link>

                    <div className="relative">
                        <button onClick={() => setIsProfileOpen(v => !v)} className="flex items-center gap-2 px-2 py-1 rounded text-gray-700 hover:text-amber-600">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="hidden sm:block text-sm font-medium">{user?.name || 'Tài khoản'}</span>
                            <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-xl">
                                <div className="py-1 text-sm">
                                    <Link to={ROUTER_URL.BUYER.SETTINGS} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Hồ sơ</Link>
                                    <Link to={ROUTER_URL.BUYER.ORDER_HISTORY} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Đơn hàng</Link>
                                    <Link to={ROUTER_URL.BUYER.FAVORITE} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Yêu thích</Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Đăng xuất</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="md:hidden p-2 text-gray-600 hover:text-amber-600" onClick={() => setIsMenuOpen(v => !v)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 py-3 bg-white">
                    <div className="max-w-7xl mx-auto px-4 flex flex-col gap-1">
                        {buyerNavItems.map(item => (
                            <Link key={item.name} to={item.href} className="px-3 py-2 rounded text-gray-700 hover:text-amber-600 hover:bg-amber-50" onClick={() => setIsMenuOpen(false)}>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default BuyerHeader; 