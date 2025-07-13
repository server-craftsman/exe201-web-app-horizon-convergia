import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthService } from '../../../services/auth/auth.service';
import type { UpdateUserRequest } from '../../../types/user/User.req.type';
import type { UserInfo } from '../../../types/user/User.res.type';
import { useVietnamAddress } from '../../../hooks/other/useVietnamAddress';
import { useRef } from 'react';

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

    // Avatar state
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Address state
    const [street, setStreet] = useState<string>("");
    const [province, setProvince] = useState<any>(null);
    const [district, setDistrict] = useState<any>(null);
    const [ward, setWard] = useState<any>(null);

    const { provinces, getDistricts, getWards, formatAddress } = useVietnamAddress();
    const districts = province ? getDistricts(province.code) : { data: [], isLoading: false };
    const wards = district ? getWards(district.code) : { data: [], isLoading: false };

    // Reset district and ward when province changes
    React.useEffect(() => {
        setDistrict(null);
        setWard(null);
    }, [province]);
    // Reset ward when district changes
    React.useEffect(() => {
        setWard(null);
    }, [district]);

    // On mount, parse address if available
    React.useEffect(() => {
        if (currentUser.address) {
            const parts = currentUser.address.split(',').map(s => s?.trim() || "");
            if (parts.length >= 4) {
                setStreet(parts[0] ?? "");
            }
        }
    }, [currentUser.address]);
    // Set province/district/ward after provinces load
    React.useEffect(() => {
        if (provinces.data && currentUser.address) {
            const parts = currentUser.address.split(',').map(s => s.trim());
            if (parts.length >= 4) {
                const provinceName = parts[3];
                const foundProvince = provinces.data.find((p: any) => p.name === provinceName);
                setProvince(foundProvince || null);
            }
        }
    }, [provinces.data, currentUser.address]);
    React.useEffect(() => {
        if (districts.data && province && currentUser.address) {
            const parts = currentUser.address.split(',').map(s => s.trim());
            if (parts.length >= 4) {
                const districtName = parts[2];
                const foundDistrict = districts.data.find((d: any) => d.name === districtName);
                setDistrict(foundDistrict || null);
            }
        }
    }, [districts.data, province, currentUser.address]);
    React.useEffect(() => {
        if (wards.data && district && currentUser.address) {
            const parts = currentUser.address.split(',').map(s => s.trim());
            if (parts.length >= 4) {
                const wardName = parts[1];
                const foundWard = wards.data.find((w: any) => w.name === wardName);
                setWard(foundWard || null);
            }
        }
    }, [wards.data, district, currentUser.address]);

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

        if (!street?.trim()) {
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

    const handleAvatarDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleAvatarFile(file);
    };
    const handleAvatarFile = (file: File) => {
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
            setAvatarError('Chỉ chấp nhận ảnh JPG, PNG, WEBP');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setAvatarError('Kích thước ảnh tối đa 2MB');
            return;
        }
        setAvatarError(null);
        setAvatarFile(file);
        // Preview
        const reader = new FileReader();
        reader.onload = (ev) => {
            handleInputChange('avatarUrl', ev.target?.result as string);
        };
        reader.readAsDataURL(file);
    };
    const handleAvatarRemove = () => {
        setAvatarFile(null);
        handleInputChange('avatarUrl', '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            let avatarUrl = formData.avatarUrl;
            if (avatarFile) {
                setUploadingAvatar(true);
                avatarUrl = await AuthService.uploadAvatar(avatarFile) || '';
                setUploadingAvatar(false);
            }
            // Compose address
            const address = formatAddress(
                street,
                ward?.name || '',
                district?.name || '',
                province?.name || ''
            );
            const updateData: UpdateUserRequest = {
                ...formData,
                phoneNumber: formData.phoneNumber || '',
                dob: formData.dob,
                avatarUrl,
                address,
            };

            await AuthService.updateUserInfo(updateData);

            // Update localStorage with new user info
            const updatedUserInfo: UserInfo = {
                ...currentUser,
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber || null,
                address,
                avatarUrl,
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
            setUploadingAvatar(false);
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
                className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
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
                        {/* Avatar Section - Professional UI */}
                        <div className="flex flex-col items-center mb-6">
                            <div
                                className={`relative h-32 w-32 rounded-full overflow-hidden border-2 border-amber-400 bg-gray-100 flex items-center justify-center group transition-shadow duration-200 ${avatarError ? 'border-red-500' : ''}`}
                                onDragOver={e => e.preventDefault()}
                                onDrop={handleAvatarDrop}
                                onClick={() => fileInputRef.current?.click()}
                                style={{ cursor: 'pointer' }}
                            >
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
                                {formData.avatarUrl && (
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 text-white hover:bg-opacity-90 transition"
                                        onClick={e => { e.stopPropagation(); handleAvatarRemove(); }}
                                        tabIndex={-1}
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                disabled={uploadingAvatar || isLoading}
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) handleAvatarFile(file);
                                }}
                            />
                            <div className="mt-2 text-xs text-gray-400 text-center">
                                Kéo & thả hoặc nhấn để chọn ảnh (JPG, PNG, WEBP, tối đa 2MB)
                            </div>
                            {avatarError && <div className="text-red-400 text-xs mt-1">{avatarError}</div>}
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

                        {/* Address Field - Professional Vietnam Address Selector */}
                        <div>
                            <label className="block font-semibold mb-2">
                                Địa chỉ <span className="text-red-400">*</span>
                            </label>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    className={`input-primary w-full ${errors.address ? 'border-red-500' : ''}`}
                                    placeholder="Số nhà, tên đường..."
                                    value={street}
                                    onChange={e => setStreet(e.target.value)}
                                    disabled={isLoading}
                                />
                                <div className="flex gap-2">
                                    <select
                                        className="input-primary flex-1"
                                        value={province?.code || ''}
                                        onChange={e => {
                                            const code = e.target.value;
                                            const found = provinces.data?.find((p: any) => p.code === code);
                                            setProvince(found || null);
                                        }}
                                        disabled={isLoading || provinces.isLoading}
                                    >
                                        <option value="">Tỉnh/Thành phố</option>
                                        {provinces.data?.map((p: any) => (
                                            <option key={p.code} value={p.code}>{p.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="input-primary flex-1"
                                        value={district?.code || ''}
                                        onChange={e => {
                                            const code = e.target.value;
                                            const found = districts.data?.find((d: any) => d.code === code);
                                            setDistrict(found || null);
                                        }}
                                        disabled={isLoading || !province || districts.isLoading}
                                    >
                                        <option value="">Quận/Huyện</option>
                                        {districts.isLoading && <option value="">Đang tải...</option>}
                                        {districts.data?.map((d: any) => (
                                            <option key={d.code} value={d.code}>{d.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="input-primary flex-1"
                                        value={ward?.code || ''}
                                        onChange={e => {
                                            const code = e.target.value;
                                            const found = wards.data?.find((w: any) => w.code === code);
                                            setWard(found || null);
                                        }}
                                        disabled={isLoading || !district || wards.isLoading}
                                    >
                                        <option value="">Phường/Xã</option>
                                        {wards.isLoading && <option value="">Đang tải...</option>}
                                        {wards.data?.map((w: any) => (
                                            <option key={w.code} value={w.code}>{w.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
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