import React, {useEffect, useRef, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import logo from '../../assets/logo.png';
import SearchComponent from '../../components/common/Search.com';
import {AnimatePresence, motion} from 'framer-motion';
import {useUserInfo} from '../../hooks';
import {UserRole} from "../../app/enums";

const HeaderLayout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const user = useUserInfo();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Effect to determine scroll position
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

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Define menu items
  const menuItems = [
    { path: '/', label: 'Trang chủ' },
    { path: '/mua-xe', label: 'Mua xe' },
    { path: '/ban-xe', label: 'Bán xe' },
    { path: '/phu-kien', label: 'Phụ kiện' },
    { path: '/tin-tuc', label: 'Tin tức' }
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
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
                className={`h-12 mr-5 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] rounded-md border-2 border-amber-400 p-1 ${
                  isScrolled ? 'animate-none' : 'animate-pulse'
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
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 transform origin-left ${
                      location.pathname === item.path ? 'scale-x-100' : 'scale-x-0'
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

          {/* Search Component */}
          <SearchComponent />

          {/* Auth Buttons or User Profile */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <motion.div 
                  className="flex items-center space-x-2 cursor-pointer bg-gray-800 rounded-full px-2 py-1 border border-gray-700 hover:border-amber-400 transition-colors"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.profilePicUrl ? (
                    <img
                      src={user.profilePicUrl}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border-2 border-amber-400"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-bold">
                      {user.name?.[0] || user.email?.[0]}
                    </div>
                  )}
                  <div className="hidden md:block">
                    <div className="font-semibold text-sm text-white">{user.name}</div>
                    <div className="text-xs text-gray-300 truncate max-w-[120px]">{user.email}</div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>

                {/* User dropdown menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-amber-400"
                        >
                          Hồ sơ cá nhân
                        </Link>
                        {user.role === UserRole.ADMIN && (
                          <Link 
                            to="/admin" 
                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-amber-400"
                          >
                            Quản trị hệ thống
                          </Link>
                        )}
                        <Link 
                          to="/orders" 
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-amber-400"
                        >
                          Đơn hàng của tôi
                        </Link>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-amber-400"
                          onClick={() => {
                            // Implement logout functionality
                            window.location.href = '/dang-nhap';
                          }}
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.button 
                  className="hidden md:block px-4 py-2 text-amber-400 border border-amber-400 rounded-md font-bold overflow-hidden relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 w-full h-full bg-amber-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>    
                  <span className="absolute inset-0 w-full h-full bg-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                  <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-300">
                    <Link to="/dang-nhap">Đăng nhập</Link>
                  </span>
                </motion.button>

                <motion.button 
                  className="px-5 py-2 font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-gray-900 rounded-md shadow-lg relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 w-0 h-full bg-white/20 transform skew-x-10 transition-all duration-500 ease-out origin-left group-hover:w-full"></span>
                  <span className="relative z-10">
                    <Link to="/dang-ky">Đăng ký</Link>
                  </span>
                </motion.button>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <motion.button 
              className="md:hidden text-amber-400 z-50"
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
          </motion.div>
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
            <nav className="flex flex-col items-center space-y-6 mb-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Link 
                    to={item.path} 
                    className={`text-2xl font-bold text-white ${location.pathname === item.path ? 'text-amber-400' : 'hover:text-amber-400'}`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <motion.div 
              className="flex flex-col space-y-4 w-64"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <input
                type="text"
                placeholder="Tìm kiếm xe, phụ kiện..."
                className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400 text-gray-200"
              />
              {!user ? (
                <>
                  <motion.button 
                    className="w-full py-3 px-6 font-bold text-gray-900 bg-amber-400 rounded-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/dang-nhap">Đăng nhập</Link>
                  </motion.button>
              
                  <motion.button 
                    className="w-full py-3 px-6 font-bold text-amber-400 border border-amber-400 rounded-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/dang-ky">Đăng ký</Link>
                  </motion.button>
                </>
              ) : (
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    {user.profilePicUrl ? (
                      <img
                        src={user.profilePicUrl}
                        alt="avatar"
                        className="w-12 h-12 rounded-full border-2 border-amber-400"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-bold text-xl">
                        {user.name?.[0] || user.email?.[0]}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-sm text-gray-300">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to="/profile" 
                      className="w-full py-2 px-4 text-left text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                    >
                      Hồ sơ cá nhân
                    </Link>
                    {user.role === UserRole.ADMIN && (
                      <Link 
                        to="/admin" 
                        className="w-full py-2 px-4 text-left text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                      >
                        Quản trị hệ thống
                      </Link>
                    )}
                    <Link 
                      to="/orders" 
                      className="w-full py-2 px-4 text-left text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                    >
                      Đơn hàng của tôi
                    </Link>
                    <button 
                      className="w-full py-2 px-4 text-left text-amber-400 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                      onClick={() => {
                        // Implement logout functionality
                        window.location.href = '/dang-nhap';
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default HeaderLayout;