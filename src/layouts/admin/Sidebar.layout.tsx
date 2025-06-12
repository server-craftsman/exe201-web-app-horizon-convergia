import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTER_URL } from '../../consts/router.path.const';
import { useLogout, useUserInfo } from '../../hooks';

const SidebarLayout: React.FC = () => {
  const location = useLocation();
  const { logout } = useLogout();
  const user = useUserInfo();

  const menuItems = [
    { path: ROUTER_URL.ADMIN.BASE, label: 'Tổng quan', icon: '📊' },
    { path: ROUTER_URL.ADMIN.USERS, label: 'Quản lý người dùng', icon: '👥' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-amber-400">Admin Panel</h1>
        {user && (
          <div className="mt-4 flex items-center space-x-3">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-bold">
                {user.name?.[0] || user.email?.[0]}
              </div>
            )}
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-gray-300">{user.email}</div>
            </div>
          </div>
        )}
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
              location.pathname === item.path ? 'bg-gray-700 text-white' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded"
        >
          <span className="mr-3">🚪</span>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default SidebarLayout;
