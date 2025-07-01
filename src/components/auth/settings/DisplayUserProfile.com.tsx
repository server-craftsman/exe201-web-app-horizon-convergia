import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UpdateUserComponent } from './UpdateUser.com';
import type { UserInfo } from '../../../types/user/User.res.type';

export const DisplayUserProfileComponent = () => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo>(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        return storedUserInfo ? JSON.parse(storedUserInfo) : {};
    });

    const handleShowUpdate = () => setShowUpdateModal(true);
    const handleCloseUpdate = () => setShowUpdateModal(false);

    const handleUserUpdate = (updatedUser: UserInfo) => {
        setUserInfo(updatedUser);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Chưa cập nhật';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="min-h-16 flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-white w-full max-w-4xl"
            >
                <div className="flex flex-col items-center">
                    {/* Avatar and Basic Info Section */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative mb-8"
                    >
                        {userInfo.avatarUrl ? (
                            <img
                                src={userInfo.avatarUrl}
                                alt="avatar"
                                className="w-40 h-40 rounded-full border-4 border-amber-400 shadow-lg object-cover"
                            />
                        ) : (
                            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-5xl shadow-lg">
                                {userInfo.name?.[0]?.toUpperCase() || userInfo.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}

                        <motion.button
                            className="absolute bottom-0 right-0 bg-secondary rounded-full p-3 cursor-pointer shadow-lg border-2 border-white"
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleShowUpdate}
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </motion.button>
                    </motion.div>

                    {/* User Details */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2 text-amber-400">
                            {userInfo.name || 'Tên người dùng'}
                        </h1>
                        <p className="text-xl text-gray-300 mb-4">
                            {userInfo.email || 'user@example.com'}
                        </p>
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                            <span className="w-2 h-2 mr-2 bg-green-400 rounded-full"></span>
                            {userInfo.status || 'Hoạt động'}
                        </div>
                    </div>

                    {/* Detailed Information Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-full max-w-2xl"
                    >
                        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-6 text-amber-400 text-center">
                                Thông tin chi tiết
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                                        Số điện thoại
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span className="text-white">
                                            {userInfo.phoneNumber || 'Chưa cập nhật'}
                                        </span>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                                        Địa chỉ
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-white">
                                            {userInfo.address || 'Chưa cập nhật'}
                                        </span>
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                                        Ngày sinh
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-white">
                                            {formatDate(userInfo.dob)}
                                        </span>
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                                        Giới tính
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-white">
                                            {userInfo.gender || 'Chưa cập nhật'}
                                        </span>
                                    </div>
                                </div>

                                {/* Role */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                                        Vai trò
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                        <span className="text-white capitalize">
                                            {userInfo.role || 'Người dùng'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Update Profile Button */}
                            <div className="mt-8 text-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleShowUpdate}
                                    className="inline-flex items-center px-6 py-3 bg-secondary text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Cập nhật thông tin
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Update User Modal */}
            <AnimatePresence>
                {showUpdateModal && (
                    <UpdateUserComponent
                        currentUser={userInfo}
                        onClose={handleCloseUpdate}
                        onUpdate={handleUserUpdate}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};