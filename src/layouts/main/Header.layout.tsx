import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import SearchComponent from '../../components/common/Search.com';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserInfo, useLogout } from '../../hooks';
import { UserRole } from '../../app/enums';
import { ROUTER_URL } from '../../consts/router.path.const';

const HeaderLayout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const user = useUserInfo();
  const { logout } = useLogout();

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

  // Định nghĩa các menu item
  const menuItems = [
    { path: '/', label: 'Trang chủ' },
    { path: '/mua-xe', label: 'Mua xe' },
    { path: '/ban-xe', label: 'Bán xe' },
    { path: '/phu-kien', label: 'Phụ kiện' },
    { path: '/tin-tuc', label: 'Tin tức' }
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

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
              <div className={`${mobile ? 'w-12 h-12' : 'w-8 h-8'} rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-bold`}>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            )}
          </motion.div>

          {/* Dropdown Menu - only show if not mobile or if mobile and userMenuOpen */}
          <AnimatePresence>
            {userMenuOpen && (!mobile || (mobile && userMenuOpen)) && (
              <motion.div
                className={`${mobile ? 'relative mt-2' : 'absolute right-0 mt-2 w-48'} bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-2 border-b border-gray-700">
                  <div className="text-xs text-gray-400">Đăng nhập với tư cách</div>
                  <div className="font-medium text-amber-400">{user.role}</div>
                </div>
                {user.role === UserRole.ADMIN && (
                  <Link to={ROUTER_URL.ADMIN.BASE} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                    Quản trị viên
                  </Link>
                )}
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  Hồ sơ cá nhân
                </Link>
                <Link to="/don-hang" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  Đơn hàng của tôi
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors border-t border-gray-700"
                >
                  Đăng xuất
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
              <span className="absolute inset-0 w-full h-full bg-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            )}
            <span className={`${mobile ? '' : 'relative z-10 group-hover:text-gray-900 transition-colors duration-300'}`}>
              <Link to="/dang-nhap">Đăng nhập</Link>
            </span>
          </motion.button>

          <motion.button
            className={`${mobile ? 'w-full py-3 px-6 font-bold text-amber-400 border border-amber-400 rounded-full' : 'px-5 py-2 font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-gray-900 rounded-md shadow-lg relative overflow-hidden group'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {!mobile && (
              <span className="absolute inset-0 w-0 h-full bg-white/20 transform skew-x-10 transition-all duration-500 ease-out origin-left group-hover:w-full"></span>
            )}
            <span className="relative z-10">
              <Link to="/dang-ky">Đăng ký</Link>
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
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 transform origin-left ${location.pathname === item.path ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    initial={false}
                    animate={{ scaleX: location.pathname === item.path ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  <span className="absolute inset-0 w-full h-full bg-amber-400/10 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Search and User Info for Desktop */}
          <div className="hidden md:flex items-center">
            <SearchComponent />

            {/* User Info for Desktop */}
            <UserProfileComponent />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <SearchComponent />
            <motion.button
              className="text-amber-400 ml-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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