import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTER_URL } from '../../../consts/router.path.const';
import { useAuth } from '@hooks/modules/useAuth.ts';
import { helpers } from '../../../utils';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { resetPassword } = useAuth();

    useEffect(() => {
        // Extract token from URL query params
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setErrorMessage('Token không hợp lệ hoặc đã hết hạn');
        }
    }, [location]);

    // Password strength checker
    useEffect(() => {
        if (!password) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        setPasswordStrength(strength);
    }, [password]);

    const getStrengthColor = () => {
        if (passwordStrength === 0) return 'bg-gray-300';
        if (passwordStrength === 1) return 'bg-red-500';
        if (passwordStrength === 2) return 'bg-yellow-500';
        if (passwordStrength === 3) return 'bg-amber-500';
        return 'bg-green-500';
    };

    const getStrengthText = () => {
        if (passwordStrength === 0) return '';
        if (passwordStrength === 1) return 'Yếu';
        if (passwordStrength === 2) return 'Trung bình';
        if (passwordStrength === 3) return 'Tốt';
        return 'Mạnh';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (password !== confirmPassword) {
            helpers.notificationMessage("Mật khẩu xác nhận không khớp", "error");
            return;
        }

        if (passwordStrength < 2) {
            helpers.notificationMessage("Mật khẩu quá yếu. Vui lòng tạo mật khẩu mạnh hơn", "error");
            return;
        }

        if (!token) {
            helpers.notificationMessage("Token không hợp lệ", "error");
            return;
        }

        resetPassword.mutate({
            token,
            newPassword: password.trim()
        }, {
            onSuccess: () => {
                setTimeout(() => {
                    navigate(ROUTER_URL.AUTH.LOGIN);
                }, 2000);
            }
        });
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
                    {errorMessage ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Đã xảy ra lỗi</h3>
                            <p className="text-gray-300 mb-6">
                                {errorMessage}
                            </p>
                            <Link to={ROUTER_URL.AUTH.FORGOT_PASSWORD}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300"
                                >
                                    Yêu cầu link mới
                                </motion.button>
                            </Link>
                        </motion.div>
                    ) : resetPassword.isSuccess ? (
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
                            <h3 className="text-xl font-bold text-white mb-2">Đặt lại mật khẩu thành công</h3>
                            <p className="text-gray-300 mb-6">
                                Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu mới.
                            </p>
                            <p className="text-gray-400 text-sm mb-6">
                                Đang chuyển hướng đến trang đăng nhập...
                            </p>
                            <Link to={ROUTER_URL.AUTH.LOGIN}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300"
                                >
                                    Đăng nhập ngay
                                </motion.button>
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl font-extrabold text-white">Đặt Lại Mật Khẩu</h2>
                                <p className="mt-2 text-sm text-gray-300">
                                    Tạo mật khẩu mới để đăng nhập vào tài khoản của bạn
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                                        Mật khẩu mới
                                    </label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                            placeholder="Nhập mật khẩu mới"
                                        />
                                        <div className="absolute left-3 top-3.5 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Password strength meter */}
                                    {password && (
                                        <div className="mt-2">
                                            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${getStrengthColor()} transition-all duration-300 ease-in-out`}
                                                    style={{ width: `${passwordStrength * 25}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-right mt-1 text-gray-400">
                                                Độ mạnh: <span className={passwordStrength > 2 ? "text-amber-400" : "text-gray-300"}>{getStrengthText()}</span>
                                            </p>
                                            <ul className="text-xs text-gray-400 mt-2 space-y-1">
                                                <li className={`${password.length >= 8 ? "text-amber-400" : ""}`}>
                                                    • Ít nhất 8 ký tự
                                                </li>
                                                <li className={`${/[A-Z]/.test(password) ? "text-amber-400" : ""}`}>
                                                    • Ít nhất 1 chữ cái viết hoa
                                                </li>
                                                <li className={`${/[0-9]/.test(password) ? "text-amber-400" : ""}`}>
                                                    • Ít nhất 1 số
                                                </li>
                                                <li className={`${/[^A-Za-z0-9]/.test(password) ? "text-amber-400" : ""}`}>
                                                    • Ít nhất 1 ký tự đặc biệt
                                                </li>
                                            </ul>
                                        </div>
                                    )}
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
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                            placeholder="Xác nhận mật khẩu mới"
                                        />
                                        <div className="absolute left-3 top-3.5 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {password && confirmPassword && password !== confirmPassword && (
                                        <p className="mt-1 text-xs text-red-400">Mật khẩu xác nhận không khớp</p>
                                    )}
                                </div>

                                <div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        // disabled={resetPassword.isLoading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-900 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {resetPassword.isSuccess ? (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null}
                                        Đặt lại mật khẩu
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
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;