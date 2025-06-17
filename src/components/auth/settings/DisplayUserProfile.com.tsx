import React, { useState } from 'react';
import { AuthService } from '../../../services/auth/auth.service';
import { motion, AnimatePresence } from 'framer-motion';

export const DisplayUserProfileComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const [userInfo, setUserInfo] = useState(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        return storedUserInfo ? JSON.parse(storedUserInfo) : {};
    });

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleUpdateProfile = async (event: React.FormEvent) => {
        event.preventDefault();
        await AuthService.updateUserInfo(userInfo);
        handleClose();
    };

    return (
        <div className="min-h-16 flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-white"
            >
                <div className="flex flex-col items-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                    >
                        {userInfo.avatarUrl ? (
                            <img src={userInfo.avatarUrl} alt="avatar" className="w-40 h-40 rounded-full border-4 border-amber-400 shadow-lg" />
                        ) : (
                            <div className="w-40 h-40 rounded-full bg-vip flex items-center justify-center text-white font-bold text-5xl shadow-lg">
                                {userInfo.name?.[0] || userInfo.email?.[0]}
                            </div>
                        )}
                        <motion.div
                            className="absolute bottom-0 right-0 bg-secondary rounded-full p-2 cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleShow}
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </motion.div>
                    </motion.div>
                    <h1 className="text-3xl font-bold mt-6 text-vip">{userInfo.name || 'User Name'}</h1>
                    <p className="text-lg text-gray-400 mt-2">{userInfo.email || 'user@example.com'}</p>

                </div>
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-md"
                        >
                            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">Cập nhật thông tin</h2>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={handleClose}
                                    className="text-gray-500 hover:text-gray-800 text-3xl font-light"
                                >
                                    &times;
                                </motion.button>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="mb-6 flex flex-col items-center">
                                        <div className="mt-1 flex items-center">
                                            <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-2 border-indigo-100">
                                                {userInfo.avatarUrl ? (
                                                    <img
                                                        className="h-full w-full object-cover"
                                                        src={userInfo.avatarUrl}
                                                        alt="Avatar Preview"
                                                    />
                                                ) : (
                                                    <img
                                                        className="h-full w-full object-cover"
                                                        src={`https://ui-avatars.com/api/?name=${userInfo.name}&background=#FBBF24&size=128`}
                                                        alt="Avatar Preview"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <label className="ml-2 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition flex items-center">
                                                {/*<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
                                                {/*    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11.5a3 3 0 11-6 0 3 3 0 016 0zM18.5 11.5a3 3 0 11-6 0 3 3 0 016 0zM12 17a5 5 0 00-5 5v1h10v-1a5 5 0 00-5-5z" />*/}
                                                {/*</svg>*/}
                                                <span>Tải lên</span>
                                                <input
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const url = await AuthService.uploadAvatar(file);
                                                            setUserInfo({ ...userInfo, avatarUrl: url });
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <label className="block font-semibold mb-2">Họ và tên</label>
                                        <input
                                            type="text"
                                            className="input-primary"
                                            placeholder="Nhập họ và tên của bạn"
                                            value={userInfo.name || ''}
                                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label className="block font-semibold mb-2">Địa chỉ</label>
                                        <input
                                            type="text"
                                            className="input-primary"
                                            placeholder="Nhập địa chỉ của bạn"
                                            value={userInfo.address || ''}
                                            onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label className="block font-semibold mb-2">Số điện thoại</label>
                                        <input
                                            type="text"
                                            className="input-primary"
                                            placeholder="Nhập số điện thoại của bạn"
                                            value={userInfo.phoneNumber || ''}
                                            onChange={(e) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            type="button"
                                            onClick={handleClose}
                                            className="px-6 py-2.5 bg-gray-200 text-gray-900 font-medium rounded-lg shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition"
                                        >
                                            Huỷ
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            type="submit"
                                            className="px-6 py-2.5 bg-secondary text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
                                        >
                                            Lưu thay đổi
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};