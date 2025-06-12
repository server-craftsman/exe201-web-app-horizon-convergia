import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTER_URL } from '../../consts/router.path.const';
import { useLogout, useUserInfo } from '../../hooks';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useUserInfo();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuItems = [
    { path: ROUTER_URL.ADMIN.BASE, label: 'Tổng quan', icon: '📊' },
    { path: ROUTER_URL.ADMIN.USERS, label: 'Quản lý người dùng', icon: '👥' },
    { path: ROUTER_URL.ADMIN.PRODUCTS, label: 'Quản lý sản phẩm', icon: '🚗' },
    { path: ROUTER_URL.ADMIN.ORDERS, label: 'Quản lý đơn hàng', icon: '📦' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/dang-nhap');
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-amber-400">Admin Panel</h1>
        
        {/* User Profile Section */}
        {user && (
          <div 
            className="mt-4 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="flex items-center space-x-3">
              {user.profilePicUrl ? (
                <img 
                  src={user.profilePicUrl} 
                  alt="avatar" 
                  className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-bold">
                  {user.name?.[0] || user.email?.[0]}
                </div>
              )}
              <div className="flex-1">
                <div className="font-semibold text-white">{user.name}</div>
                <div className="text-xs text-gray-300 truncate max-w-[150px]">{user.email}</div>
              </div>
              <motion.div
                animate={{ rotate: userMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>

            {/* User Menu Dropdown */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div 
                  className="mt-3 space-y-2 border-t border-gray-600 pt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-xs text-gray-400 mb-1">Role: {user.role}</div>
                  <Link 
                    to="/profile" 
                    className="block py-1 px-2 text-sm text-gray-300 hover:text-amber-400 transition-colors rounded"
                  >
                    Xem hồ sơ
                  </Link>
                  <Link 
                    to="/" 
                    className="block py-1 px-2 text-sm text-gray-300 hover:text-amber-400 transition-colors rounded"
                  >
                    Về trang chủ
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      <nav className="mt-6 flex-1 overflow-y-auto">
        <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Quản lý hệ thống
        </div>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
              location.pathname === item.path ? 'bg-gray-700 text-white border-l-4 border-amber-400' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
        
        <div className="px-4 mt-8 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Cài đặt
        </div>
        <Link
          to={ROUTER_URL.ADMIN.SETTINGS}
          className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
            location.pathname === ROUTER_URL.ADMIN.SETTINGS ? 'bg-gray-700 text-white border-l-4 border-amber-400' : ''
          }`}
        >
          <span className="mr-3">⚙️</span>
          Cấu hình hệ thống
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md bg-gray-700/50"
        >
          <span className="mr-3">🚪</span>
          Đăng xuất
        </button>
        <div className="mt-4 text-xs text-center text-gray-500">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;