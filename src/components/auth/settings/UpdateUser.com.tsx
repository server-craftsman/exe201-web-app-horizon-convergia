import React, { useState, useMemo } from 'react';
import { AuthService } from '@services/auth/auth.service';
import type { UpdateUserRequest } from '../../../types/user/User.req.type';
import type { UserInfo } from '../../../types/user/User.res.type';
import { UserRole } from '@app/enums/userRole.enum';
import { useBank } from '../../../hooks/other/useBank';
import { useVietnamAddress } from '../../../hooks/other/useVietnamAddress';
import Select from 'react-select';

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
    const { banks } = useBank();
    const { provinces, getDistricts, getWards } = useVietnamAddress();
    
    const [formData, setFormData] = useState<UpdateUserRequest & { 
        provinceCode?: string; 
        districtCode?: string; 
        wardCode?: string; 
        streetAddress?: string;
        bankOption?: any;
    }>({
        id: currentUser.id?.toString() || '',
        name: currentUser.name || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber?.toString() || '',
        address: currentUser.address || '',
        avatarUrl: currentUser.avatarUrl || '',
        dob: currentUser.dob ? new Date(currentUser.dob) : new Date(),
        gender: currentUser.gender || 0,
        shopName: currentUser.shopName || '',
        shopDescription: currentUser.shopDescription || '',
        businessType: currentUser.businessType || '',
        bankName: currentUser.bankName || '',
        bankAccountNumber: currentUser.bankAccountNumber || '',
        bankAccountHolder: currentUser.bankAccountHolder || (currentUser as any).bankAccountName || '',
        provinceCode: '',
        districtCode: '',
        wardCode: '',
        streetAddress: '',
        bankOption: null,
    });

    const districts = getDistricts(formData.provinceCode || '');
    const wards = getWards(formData.districtCode || '');

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    // Helper cho react-select options
    const getBankOptions = (banks: Array<{ code: string; name: string; logo?: string }>) =>
        banks.map((bank) => ({
            value: bank.code,
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {bank.logo && (
                        <img src={bank.logo} alt={bank.name} style={{ width: 24, height: 24, objectFit: 'contain', borderRadius: 4 }} />
                    )}
                    <span>{bank.name}</span>
                </div>
            ),
            bank,
        }));

    const bankOptions = useMemo(() => getBankOptions(banks), [banks]);

    // Địa chỉ preview cho UI
    const getNameByCode = (list: any[], code: string) => {
        if (!Array.isArray(list) || !code) return '';
        const found = list.find((item: any) => item.code?.toString() === code?.toString());
        return found?.name || '';
    };

    const wardName = getNameByCode(wards.data, String(formData.wardCode ?? ''));
    const districtName = getNameByCode(districts.data, String(formData.districtCode ?? ''));
    const provinceName = getNameByCode(provinces.data, String(formData.provinceCode ?? ''));

    const previewAddress = [
        formData.streetAddress?.trim(),
        wardName?.trim(),
        districtName?.trim(),
        provinceName?.trim()
    ].filter(Boolean).join(', ');

    const handleInputChange = (field: string, value: string | Date | number | any) => {
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

        // Handle address selections
        if (field === 'provinceCode') {
            setFormData(prev => ({ ...prev, districtCode: '', wardCode: '' }));
        } else if (field === 'districtCode') {
            setFormData(prev => ({ ...prev, wardCode: '' }));
        }

        // Handle bank selection - chỉ lưu thông tin cần thiết
        if (field === 'bankOption' && value) {
            setFormData(prev => ({
                ...prev,
                bankOption: {
                    value: value.value,
                    label: value.bank?.name || '',
                    bank: {
                        name: value.bank?.name || '',
                        code: value.bank?.code || value.value,
                        logo: value.bank?.logo || ''
                    }
                }
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Enhanced validation
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

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            // Xử lý địa chỉ từ các trường riêng biệt
            const addressParts = [
                formData.streetAddress?.trim(),
                wardName?.trim(),
                districtName?.trim(),
                provinceName?.trim()
            ].filter(Boolean);

            const finalAddress = addressParts.length > 0 ? addressParts.join(', ') : formData.address;

            const updateData: UpdateUserRequest = {
                ...formData,
                phoneNumber: formData.phoneNumber || '',
                dob: formData.dob,
                avatarUrl: formData.avatarUrl,
                address: finalAddress,
                gender: formData.gender !== null && formData.gender !== undefined ? formData.gender : 0,
                shopName: formData.shopName || '',
                shopDescription: formData.shopDescription || '',
                businessType: formData.businessType || '',
                bankName: formData.bankOption?.bank?.name || formData.bankName || '',
                bankAccountNumber: formData.bankAccountNumber || '',
                bankAccountHolder: formData.bankAccountHolder || '',
            };

            await AuthService.updateUserInfo(updateData);

            // Update localStorage with new user info
            const updatedUserInfo: UserInfo = {
                ...currentUser,
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber || null,
                address: finalAddress,
                avatarUrl: formData.avatarUrl,
                dob: formData.dob.toISOString(),
                gender: formData.gender !== null && formData.gender !== undefined ? formData.gender : 0,
                shopName: formData.shopName || undefined,
                shopDescription: formData.shopDescription || undefined,
                businessType: formData.businessType || undefined,
                bankName: formData.bankOption?.bank?.name || formData.bankName || undefined,
                bankAccountNumber: formData.bankAccountNumber || undefined,
                bankAccountHolder: formData.bankAccountHolder || undefined,
            };

            // Tạo một object clean không có circular reference để lưu localStorage
            const cleanUserInfo = JSON.parse(JSON.stringify(updatedUserInfo));
            localStorage.setItem('userInfo', JSON.stringify(cleanUserInfo));
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
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '1rem'
            }}
        >
            <div
                style={{
                    backgroundColor: '#1f2937',
                    borderRadius: '1rem',
                    padding: '2rem',
                    width: '100%',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    border: '1px solid #374151',
                    color: 'white'
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #374151', paddingBottom: '1rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Cập nhật thông tin</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#9CA3AF',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            padding: '0.25rem'
                        }}
                        disabled={isLoading}
                    >
                        ×
                    </button>
                </div>

                {/* Error Message */}
                {errors.general && (
                    <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#FEE2E2', border: '1px solid #F87171', color: '#B91C1C', borderRadius: '0.375rem' }}>
                        {errors.general}
                    </div>
                )}

                {/* Simple Test Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Section 1: Thông tin cá nhân */}
                    <div style={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.7)', 
                        border: '1px solid #374151', 
                        borderRadius: '0.75rem', 
                        padding: '1.5rem' 
                    }}>
                        <h4 style={{ 
                            fontSize: '1.125rem', 
                            fontWeight: '600', 
                            color: '#F59E0B', 
                            marginBottom: '1rem',
                            margin: '0 0 1rem 0'
                        }}>
                            Thông tin cá nhân
                        </h4>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                            gap: '1rem' 
                        }}>
                            {/* Name Field */}
                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#EF4444' }}>*</span> Họ và tên
                                </label>
                                <input
                                    type="text"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: errors.name ? '1px solid #EF4444' : '1px solid #4B5563',
                                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="Nhập họ và tên của bạn"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    disabled={isLoading}
                                />
                                {errors.name && (
                                    <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#EF4444' }}>*</span> Email
                                </label>
                                <input
                                    type="email"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: errors.email ? '1px solid #EF4444' : '1px solid #4B5563',
                                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="Nhập email của bạn"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>
                                )}
                            </div>

                            {/* Phone Number Field */}
                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: errors.phoneNumber ? '1px solid #EF4444' : '1px solid #4B5563',
                                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="Nhập số điện thoại của bạn"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    disabled={isLoading}
                                />
                                {errors.phoneNumber && (
                                    <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phoneNumber}</p>
                                )}
                            </div>

                            {/* Date of Birth Field */}
                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: errors.dob ? '1px solid #EF4444' : '1px solid #4B5563',
                                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                    value={formData.dob ? formData.dob.toISOString().split('T')[0] : ''}
                                    onChange={(e) => handleInputChange('dob', new Date(e.target.value))}
                                    disabled={isLoading}
                                />
                                {errors.dob && (
                                    <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.dob}</p>
                                )}
                            </div>

                            {/* Gender Field */}
                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Giới tính
                                </label>
                                <select
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #4B5563',
                                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                    value={formData.gender !== null && formData.gender !== undefined ? formData.gender : 0}
                                    onChange={(e) => handleInputChange('gender', parseInt(e.target.value))}
                                    disabled={isLoading}
                                >
                                    <option value={0}>Nam</option>
                                    <option value={1}>Nữ</option>
                                    <option value={2}>Khác</option>
                                </select>
                            </div>
                        </div>

                        {/* Địa chỉ chi tiết section */}
                        <div style={{ marginTop: '1.5rem' }}>
                            <h5 style={{ 
                                fontSize: '1rem', 
                                fontWeight: '600', 
                                color: '#D1D5DB', 
                                marginBottom: '1rem',
                                margin: '0 0 1rem 0'
                            }}>
                                Địa chỉ chi tiết
                            </h5>
                            
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                gap: '1rem',
                                marginBottom: '1rem'
                            }}>
                                {/* Tỉnh/Thành phố */}
                                <div>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                        Tỉnh/Thành phố
                                    </label>
                                    <select
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #4B5563',
                                            backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                            color: 'white',
                                            fontSize: '0.875rem'
                                        }}
                                        value={formData.provinceCode || ''}
                                        onChange={(e) => handleInputChange('provinceCode', e.target.value)}
                                        disabled={isLoading}
                                    >
                                        <option value="">Chọn tỉnh/thành phố</option>
                                        {provinces.data?.map((province: any) => (
                                            <option key={province.code} value={province.code}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Quận/Huyện */}
                                <div>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                        Quận/Huyện
                                    </label>
                                    <select
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #4B5563',
                                            backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                            color: 'white',
                                            fontSize: '0.875rem'
                                        }}
                                        value={formData.districtCode || ''}
                                        onChange={(e) => handleInputChange('districtCode', e.target.value)}
                                        disabled={isLoading || !formData.provinceCode}
                                    >
                                        <option value="">Chọn quận/huyện</option>
                                        {districts.data?.map((district: any) => (
                                            <option key={district.code} value={district.code}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Phường/Xã */}
                                <div>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                        Phường/Xã
                                    </label>
                                    <select
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #4B5563',
                                            backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                            color: 'white',
                                            fontSize: '0.875rem'
                                        }}
                                        value={formData.wardCode || ''}
                                        onChange={(e) => handleInputChange('wardCode', e.target.value)}
                                        disabled={isLoading || !formData.districtCode}
                                    >
                                        <option value="">Chọn phường/xã</option>
                                        {wards.data?.map((ward: any) => (
                                            <option key={ward.code} value={ward.code}>
                                                {ward.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Địa chỉ chi tiết */}
                            <div>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                    Địa chỉ chi tiết (số nhà, tên đường)
                                </label>
                                <input
                                    type="text"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #4B5563',
                                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                        color: 'white',
                                        fontSize: '0.875rem'
                                    }}
                                    placeholder="Nhập số nhà, tên đường"
                                    value={formData.streetAddress || ''}
                                    onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Address Preview */}
                            {previewAddress && (
                                <div style={{ marginTop: '0.75rem' }}>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                        Địa chỉ đầy đủ:
                                    </label>
                                    <div style={{ 
                                        padding: '0.75rem', 
                                        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                                        border: '1px solid #3B82F6', 
                                        borderRadius: '0.5rem', 
                                        fontSize: '0.875rem',
                                        color: '#93C5FD'
                                    }}>
                                        {previewAddress}
                                    </div>
                                </div>
                            )}

                            {/* Địa chỉ hiện tại fallback */}
                            {!previewAddress && formData.address && (
                                <div style={{ marginTop: '0.75rem' }}>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                        Địa chỉ hiện tại:
                                    </label>
                                    <input
                                        type="text"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #4B5563',
                                            backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                            color: 'white',
                                            fontSize: '0.875rem'
                                        }}
                                        placeholder="Nhập địa chỉ của bạn"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seller-specific fields */}
                    {((currentUser.role as any) === UserRole.SELLER || (currentUser.role as any) === 'Seller' || (currentUser.role as any) === 1) && (
                        <>
                            {/* Section 2: Thông tin cửa hàng */}
                            <div style={{ 
                                backgroundColor: 'rgba(31, 41, 55, 0.7)', 
                                border: '1px solid #374151', 
                                borderRadius: '0.75rem', 
                                padding: '1.5rem' 
                            }}>
                                <h4 style={{ 
                                    fontSize: '1.125rem', 
                                    fontWeight: '600', 
                                    color: '#F59E0B', 
                                    marginBottom: '1rem',
                                    margin: '0 0 1rem 0'
                                }}>
                                    🏪 Thông tin cửa hàng
                                </h4>
                                
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                                    gap: '1rem' 
                                }}>
                                    {/* Shop Name */}
                                    <div>
                                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                            Tên cửa hàng
                                        </label>
                                        <input
                                            type="text"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                border: '1px solid #4B5563',
                                                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                                color: 'white',
                                                fontSize: '1rem'
                                            }}
                                            placeholder="Nhập tên cửa hàng của bạn"
                                            value={formData.shopName || ''}
                                            onChange={(e) => handleInputChange('shopName', e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Business Type */}
                                    <div>
                                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                            Loại hình kinh doanh
                                        </label>
                                        <select
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                border: '1px solid #4B5563',
                                                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                                color: 'white',
                                                fontSize: '1rem'
                                            }}
                                            value={formData.businessType || ''}
                                            onChange={(e) => handleInputChange('businessType', e.target.value)}
                                            disabled={isLoading}
                                        >
                                            <option value="">Chọn loại hình kinh doanh</option>
                                            <option value="motorcycle-parts">Phụ tùng xe máy</option>
                                            <option value="motorcycle-accessories">Phụ kiện xe máy</option>
                                            <option value="motorcycle-maintenance">Bảo dưỡng sửa chữa</option>
                                            <option value="motorcycle-sales">Mua bán xe máy</option>
                                            <option value="motorcycle-rental">Cho thuê xe máy</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Shop Description - full width */}
                                <div style={{ marginTop: '1rem' }}>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                        Mô tả cửa hàng
                                    </label>
                                    <textarea
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #4B5563',
                                            backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                            color: 'white',
                                            fontSize: '1rem',
                                            minHeight: '100px',
                                            resize: 'vertical'
                                        }}
                                        placeholder="Mô tả về cửa hàng của bạn..."
                                        value={formData.shopDescription || ''}
                                        onChange={(e) => handleInputChange('shopDescription', e.target.value)}
                                        disabled={isLoading}
                                        rows={4}
                                    />
                                </div>
                            </div>

                            {/* Section 3: Thông tin ngân hàng */}
                            <div style={{ 
                                backgroundColor: 'rgba(31, 41, 55, 0.7)', 
                                border: '1px solid #374151', 
                                borderRadius: '0.75rem', 
                                padding: '1.5rem' 
                            }}>
                                <h4 style={{ 
                                    fontSize: '1.125rem', 
                                    fontWeight: '600', 
                                    color: '#F59E0B', 
                                    marginBottom: '1rem',
                                    margin: '0 0 1rem 0'
                                }}>
                                    🏦 Thông tin ngân hàng
                                </h4>
                                
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                                    gap: '1rem' 
                                }}>
                                    {/* Bank Name với Select */}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                            Ngân hàng
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <Select
                                                options={bankOptions}
                                                value={formData.bankOption}
                                                onChange={(selectedOption) => handleInputChange('bankOption', selectedOption)}
                                                placeholder="Chọn ngân hàng..."
                                                isDisabled={isLoading}
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                                        border: '1px solid #4B5563',
                                                        borderRadius: '0.5rem',
                                                        minHeight: '48px',
                                                        color: 'white'
                                                    }),
                                                    singleValue: (provided) => ({
                                                        ...provided,
                                                        color: 'white'
                                                    }),
                                                    placeholder: (provided) => ({
                                                        ...provided,
                                                        color: '#9CA3AF'
                                                    }),
                                                    input: (provided) => ({
                                                        ...provided,
                                                        color: 'white'
                                                    }),
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        backgroundColor: '#1F2937',
                                                        border: '1px solid #374151'
                                                    }),
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        backgroundColor: state.isFocused ? '#374151' : '#1F2937',
                                                        color: 'white',
                                                        cursor: 'pointer'
                                                    })
                                                }}
                                            />
                                        </div>
                                        {/* Fallback input nếu không chọn từ select */}
                                        {!formData.bankOption && (
                                            <input
                                                type="text"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    borderRadius: '0.5rem',
                                                    border: '1px solid #4B5563',
                                                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                                    color: 'white',
                                                    fontSize: '1rem',
                                                    marginTop: '0.5rem'
                                                }}
                                                placeholder="Hoặc nhập tên ngân hàng khác"
                                                value={formData.bankName || ''}
                                                onChange={(e) => handleInputChange('bankName', e.target.value)}
                                                disabled={isLoading}
                                            />
                                        )}
                                    </div>

                                    {/* Bank Account Number */}
                                    <div>
                                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                            Số tài khoản
                                        </label>
                                        <input
                                            type="text"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                border: '1px solid #4B5563',
                                                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                                color: 'white',
                                                fontSize: '1rem'
                                            }}
                                            placeholder="Nhập số tài khoản ngân hàng"
                                            value={formData.bankAccountNumber || ''}
                                            onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Bank Account Holder */}
                                    <div>
                                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                                            Chủ tài khoản
                                        </label>
                                        <input
                                            type="text"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                border: '1px solid #4B5563',
                                                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                                color: 'white',
                                                fontSize: '1rem'
                                            }}
                                            placeholder="Nhập tên chủ tài khoản"
                                            value={formData.bankAccountHolder || ''}
                                            onChange={(e) => handleInputChange('bankAccountHolder', e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #374151', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#4B5563',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Huỷ
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#F59E0B',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                opacity: isLoading ? 0.5 : 1
                            }}
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 