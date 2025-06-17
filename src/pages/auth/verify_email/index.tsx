import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTER_URL } from '../../../consts/router.path.const';
import { useAuth } from '../../../hooks/useAuth';

const VerifyEmail = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Đang xác thực email của bạn...');

    const location = useLocation();
    const navigate = useNavigate();
    const { verifyEmail } = useAuth();

    useEffect(() => {
        const verifyUserEmail = async () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                const token = queryParams.get('token');

                if (!token) {
                    setStatus('error');
                    setMessage('Token xác thực không hợp lệ.');
                    return;
                }

                verifyEmail.mutate(token, {
                    onSuccess: () => {
                        setStatus('success');
                        setMessage('Email của bạn đã được xác thực thành công!');

                        // Redirect to login page after 3 seconds
                        setTimeout(() => {
                            navigate(ROUTER_URL.AUTH.LOGIN);
                        }, 3000);
                    },
                    onError: (error: any) => {
                        setStatus('error');
                        setMessage(error?.response?.data?.message || 'Không thể xác thực email. Token có thể đã hết hạn hoặc không hợp lệ.');
                    }
                });
            } catch (error) {
                setStatus('error');
                setMessage('Đã xảy ra lỗi trong quá trình xác thực email.');
            }
        };

        verifyUserEmail();
    }, [location, navigate, verifyEmail]);

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="text-center py-8">
                        <div className="mx-auto mb-6 relative w-16 h-16">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-4 border-amber-400/20"
                            />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear",
                                    repeatDelay: 0.25
                                }}
                                className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Đang xác thực...</h3>
                        <p className="text-gray-300">Vui lòng đợi trong giây lát</p>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center py-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/20 mb-6"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </motion.div>
                        <h3 className="text-xl font-bold text-white mb-2">Xác thực thành công!</h3>
                        <p className="text-gray-300 mb-6">{message}</p>
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
                    </div>
                );

            case 'error':
                return (
                    <div className="text-center py-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Xác thực thất bại</h3>
                        <p className="text-gray-300 mb-6">{message}</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                            <Link to={ROUTER_URL.AUTH.LOGIN}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50"
                                >
                                    Đăng nhập
                                </motion.button>
                            </Link>
                            <Link to={ROUTER_URL.COMMON.HOME}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300"
                                >
                                    Về trang chủ
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                );
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
                    className="bg-white/10 backdrop-blur-lg py-8 px-6 sm:px-10 rounded-xl shadow-2xl border border-white/10"
                >
                    <div className="mb-4 text-center">
                        <h2 className="text-2xl font-extrabold text-white">Xác Thực Email</h2>
                    </div>

                    {renderContent()}

                </motion.div>
            </div>
        </div>
    );
};

export default VerifyEmail;