import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthService } from '../../../services/auth/auth.service';
import type { UpdateUserRequest } from '../../../types/user/User.req.type';
import type { UserInfo } from '../../../types/user/User.res.type';

interface UpdateUserProps {
    onClose: () => void;
    onUpdate: (updatedUser: UserInfo) => void;
    currentUser: UserInfo;
}

interface FormErrors {
    name?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    dob?: string;
    general?: string;
}

export const UpdateUserComponent: React.FC<UpdateUserProps> = ({
    onClose,
    onUpdate,
    currentUser
}) => {
    const [formData, setFormData] = useState<UpdateUserRequest>({
        id: currentUser.id?.toString() || '',
        name: currentUser.name || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber?.toString() || '',
        address: currentUser.address || '',
        avatarUrl: currentUser.avatarUrl || '',
        dob: currentUser.dob ? new Date(currentUser.dob) : new Date(),
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Họ và tên là bắt buộc';
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (formData.phoneNumber && !/^\d{10,11}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Số điện thoại phải có 10-11 chữ số';
        }

        if (!formData.address?.trim()) {
            newErrors.address = 'Địa chỉ là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof UpdateUserRequest, value: string | Date) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleAvatarUpload = async (file: File) => {
        if (!file) return;

        setUploadingAvatar(true);
        try {
            const uploadedUrl = await AuthService.uploadAvatar(file);
            if (uploadedUrl) {
                handleInputChange('avatarUrl', uploadedUrl);
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setErrors(prev => ({
                ...prev,
                general: 'Lỗi khi tải lên ảnh đại diện'
            }));
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const updateData: UpdateUserRequest = {
                ...formData,
                phoneNumber: formData.phoneNumber || '',
                dob: formData.dob
            };

            await AuthService.updateUserInfo(updateData);

            // Update localStorage with new user info
            const updatedUserInfo: UserInfo = {
                ...currentUser,
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber || null,
                address: formData.address,
                avatarUrl: formData.avatarUrl,
                dob: formData.dob.toISOString(),
            };

            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            onUpdate(updatedUserInfo);
            onClose();
        } catch (error: any) {
            console.error('Error updating user:', error);
            setErrors({
                general: error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
                <div className="border-b border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Cập nhật thông tin</h2>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-3xl font-light"
                        disabled={isLoading}
                    >
                        &times;
                    </motion.button>
                </div>

                <div className="p-6">
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-2 border-amber-400">
                                {formData.avatarUrl ? (
                                    <img
                                        className="h-full w-full object-cover"
                                        src={formData.avatarUrl}
                                        alt="Avatar Preview"
                                    />
                                ) : (
                                    <img
                                        className="h-full w-full object-cover"
                                        src={`https://ui-avatars.com/api/?name=${formData.name}&background=FBBF24&size=128`}
                                        alt="Avatar Preview"
                                    />
                                )}
                                {uploadingAvatar && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    </div>
                                )}
                            </div>

                            <label className="mt-4 bg-secondary py-2 px-4 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 cursor-pointer transition flex items-center">
                                <span>{uploadingAvatar ? 'Đang tải...' : 'Tải lên ảnh'}</span>
                                <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    disabled={uploadingAvatar || isLoading}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleAvatarUpload(file);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        {/* Name Field */}
                        <div>
                            <label className="block font-semibold mb-2">
                                Họ và tên <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                className={`input-primary w-full ${errors.name ? 'border-red-500' : ''}`}
                                placeholder="Nhập họ và tên của bạn"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block font-semibold mb-2">
                                Email <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                className={`input-primary w-full ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="Nhập email của bạn"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <label className="block font-semibold mb-2">Số điện thoại</label>
                            <input
                                type="tel"
                                className={`input-primary w-full ${errors.phoneNumber ? 'border-red-500' : ''}`}
                                placeholder="Nhập số điện thoại của bạn"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                disabled={isLoading}
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
                            )}
                        </div>

                        {/* Address Field */}
                        <div>
                            <label className="block font-semibold mb-2">
                                Địa chỉ <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                className={`input-primary w-full ${errors.address ? 'border-red-500' : ''}`}
                                placeholder="Nhập địa chỉ của bạn"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                disabled={isLoading}
                            />
                            {errors.address && (
                                <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                            )}
                        </div>

                        {/* Date of Birth Field */}
                        <div>
                            <label className="block font-semibold mb-2">Ngày sinh</label>
                            <input
                                type="date"
                                className={`input-primary w-full ${errors.dob ? 'border-red-500' : ''}`}
                                value={formData.dob ? formData.dob.toISOString().split('T')[0] : ''}
                                onChange={(e) => handleInputChange('dob', new Date(e.target.value))}
                                disabled={isLoading}
                            />
                            {errors.dob && (
                                <p className="text-red-400 text-sm mt-1">{errors.dob}</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-gray-600 text-white font-medium rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition disabled:opacity-50"
                            >
                                Huỷ
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={isLoading || uploadingAvatar}
                                className="px-6 py-2.5 bg-secondary text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang lưu...
                                    </div>
                                ) : (
                                    'Lưu thay đổi'
                                )}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
}; 