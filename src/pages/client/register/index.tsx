import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTER_URL } from '../../../consts/router.path.const';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full -top-20 -right-20 blur-3xl"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full -bottom-20 -left-20 blur-3xl"></div>
        
        {/* Animated Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-amber-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link to={ROUTER_URL.COMMON.HOME}>
            <h2 className="text-3xl font-bold text-amber-400 mb-1">HORIZON CONVERGIA</h2>
            <p className="text-gray-300 text-sm tracking-wider uppercase">Thế giới xe máy của bạn</p>
          </Link>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg py-8 px-4 sm:px-10 rounded-xl shadow-2xl border border-white/10"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-extrabold text-white">Đăng Ký Tài Khoản</h2>
            <p className="mt-2 text-sm text-gray-300">
              Đã có tài khoản?{' '}
              <Link to={ROUTER_URL.AUTH.LOGIN} className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-200">
                  Họ và tên
                </label>
                <div className="mt-1 relative">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Nguyễn Văn A"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-200">
                  Số điện thoại
                </label>
                <div className="mt-1 relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="0901234567"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="example@gmail.com"
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Mật khẩu
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="••••••••"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                  Xác nhận mật khẩu
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="••••••••"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-600 rounded bg-gray-800"
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-300">
                Tôi đồng ý với{' '}
                <a href="#" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
                  điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a href="#" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
                  chính sách bảo mật
                </a>
              </label>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-900 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-300"
              >
                Đăng ký
              </motion.button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800/50 backdrop-blur text-gray-300">Hoặc đăng ký với</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm bg-gray-800/50 text-sm font-medium text-gray-200 hover:bg-gray-700/50 transition-colors"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm bg-gray-800/50 text-sm font-medium text-gray-200 hover:bg-gray-700/50 transition-colors"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;