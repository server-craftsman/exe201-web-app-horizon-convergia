import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTER_URL } from '../../../consts/router.path.const';
import { useAuth } from '@hooks/modules/useAuth.ts';
import { helpers } from '../../../utils';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            helpers.notificationMessage("Vui lòng nhập email", "error");
            return;
        }
        
        try {
            await forgotPassword.mutateAsync(email.trim());
            setSubmitted(true);
            helpers.notificationMessage("Đã gửi link đặt lại mật khẩu đến email của bạn", "success");
        } catch (error) {
            console.error('Forgot password error:', error);
            helpers.notificationMessage("Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu", "error");
        }
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
                    {!submitted ? (
                        <>
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl font-extrabold text-white">Quên Mật Khẩu</h2>
                                <p className="mt-2 text-sm text-gray-300">
                                    Chúng tôi sẽ gửi link đặt lại mật khẩu đến email của bạn
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
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-900 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {forgotPassword ? (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null}
                                        Gửi Link Đặt Lại Mật Khẩu
                                    </motion.button>
                                </div>

                                <div className="flex items-center justify-center mt-4">
                                    <Link to={ROUTER_URL.AUTH.LOGIN} className="text-amber-400 hover:text-amber-300 transition-colors text-sm">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Quay lại trang đăng nhập
                    </span>
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/20 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Kiểm tra email của bạn</h3>
                            <p className="text-gray-300 mb-6">
                                Chúng tôi đã gửi đường dẫn đặt lại mật khẩu đến email: <span className="text-amber-400">{email}</span>
                            </p>
                            <Link to={ROUTER_URL.AUTH.LOGIN}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300"
                                >
                                    Quay lại đăng nhập
                                </motion.button>
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;