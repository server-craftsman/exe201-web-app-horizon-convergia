import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTER_URL } from '../../../consts/router.path.const';
import { useLogin } from '@hooks/modules/useAuth.ts';
import { helpers } from '../../../utils';
import { AuthService } from '../../../services/auth/auth.service';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      helpers.notificationMessage("Vui lòng nhập email và mật khẩu", "error");
      return;
    }
    login.mutate({ email: email.trim(), password: password.trim() });
  };

  const handleGoogleLogin = async () => {
    try {
      // Call your backend to get Google OAuth URL
      const response = await AuthService.loginViaGoogle();

      // Redirect to Google OAuth URL
      if (response?.data?.data) {
        window.location.href = response.data.data; // URL từ backend
      }
    } catch (error) {
      console.error('Google login error:', error);
      helpers.notificationMessage("Lỗi đăng nhập Google", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full -top-20 -left-20 blur-3xl"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full -bottom-20 -right-20 blur-3xl"></div>

        {/* Animated Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/20 rounded-full"
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

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg py-8 px-4 sm:px-10 rounded-xl shadow-2xl border border-white/10"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-extrabold text-white">Đăng Nhập</h2>
            <p className="mt-2 text-sm text-gray-300">
              Hoặc{' '}
              <Link to={ROUTER_URL.AUTH.SIGN_UP} className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
                đăng ký tài khoản mới
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="nhập email của bạn"
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Mật khẩu
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="nhập mật khẩu của bạn"
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-600 rounded bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <Link to={ROUTER_URL.AUTH.FORGOT_PASSWORD} className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-900 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-300"
              >
                Đăng nhập
              </motion.button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800/50 backdrop-blur text-gray-300">Hoặc đăng nhập với</span>
              </div>
            </div>

            <div className="mt-6 gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-red-500/30 rounded-lg shadow-lg bg-gradient-to-r from-red-500/10 to-red-600/10 backdrop-blur-sm text-sm font-medium text-white hover:from-red-500/20 hover:to-red-600/20 hover:border-red-400/50 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Animated background effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500/20 to-red-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>

                  {/* Google icon with enhanced styling */}
                  <motion.svg
                    className="h-6 w-6 text-white group-hover:text-red-100 transition-colors duration-300 relative z-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                  </motion.svg>

                  {/* Google text label */}
                  <span className="ml-2 relative z-10 group-hover:text-red-100 transition-colors duration-300 font-semibold">
                    Google
                  </span>

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-red-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </button>
              </motion.div>

              {/* <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  className="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-blue-500/30 rounded-lg shadow-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm text-sm font-medium text-white hover:from-blue-500/20 hover:to-blue-600/20 hover:border-blue-400/50 transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>


                  <motion.svg
                    className="h-6 w-6 text-white group-hover:text-blue-100 transition-colors duration-300 relative z-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    whileHover={{ rotate: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </motion.svg>


                  <span className="ml-2 relative z-10 group-hover:text-blue-100 transition-colors duration-300 font-semibold">
                    Facebook
                  </span>

                  <div className="absolute inset-0 rounded-lg bg-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </button>
              </motion.div> */}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;