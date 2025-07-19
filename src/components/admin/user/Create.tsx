import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RegisterRequest } from '../../../types/user/User.req.type';
import { helpers } from '@utils/index';
import { UserSerice } from '@services/user/user.service';
import Select from 'react-select';
import { useBank } from '../../../hooks/other/useBank';
import { useVietnamAddress } from '../../../hooks/other/useVietnamAddress';
import { UserRoleInteger } from '../../../app/enums/userRole.enum';
import { Gender } from '../../../app/enums/gender.enum';
import CourseraEditor from '../../common/CourseraEditor';


interface AddUserModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  onAddUser?: (user: { id: string; name?: string; email: string; phoneNumber?: string; role: number }) => void;
}

export const AddUserModal = ({ open, onCancel, onSuccess, onAddUser }: AddUserModalProps) => {
  const [formData, setFormData] = useState<Omit<RegisterRequest, 'gender' | 'address'> & { gender: Gender | undefined; role: UserRoleInteger | undefined; provinceCode?: string; districtCode?: string; wardCode?: string; streetAddress?: string }>({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: undefined,
    dob: new Date(),
    role: undefined, // undefined means not selected
    shopName: '',
    shopDescription: '',
    businessType: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountHolder: '',
    provinceCode: '',
    districtCode: '',
    wardCode: '',
    streetAddress: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { banks, isLoading: isLoadingBanks } = useBank();
  const { provinces, getDistricts, getWards} = useVietnamAddress();
  const districts = getDistricts(formData.provinceCode || '');
  const wards = getWards(formData.districtCode || '');

  useEffect(() => {
    if (open && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [open]);

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name?.trim()) newErrors.name = 'Tên là bắt buộc';
    if (!formData.email?.trim()) newErrors.email = 'Email là bắt buộc';
    if (!formData.password?.trim()) newErrors.password = 'Mật khẩu là bắt buộc';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    if (!formData.dob) newErrors.dob = 'Ngày sinh là bắt buộc';
    if (formData.gender === undefined || formData.gender === null) newErrors.gender = 'Giới tính là bắt buộc';
    if (formData.role === undefined) newErrors.role = 'Vai trò là bắt buộc';
    // Validate seller fields
    if (formData.role === UserRoleInteger.SELLER) {
      if (!formData.shopName?.trim()) newErrors.shopName = 'Tên shop là bắt buộc';
      if (!formData.shopDescription?.trim()) newErrors.shopDescription = 'Mô tả shop là bắt buộc';
      if (!formData.businessType?.trim()) newErrors.businessType = 'Loại hình kinh doanh là bắt buộc';
    }
    // Validate bank fields for both seller and shipper
    if (formData.role === UserRoleInteger.SELLER || formData.role === UserRoleInteger.SHIPPER) {
      if (!formData.bankName?.trim()) newErrors.bankName = 'Tên ngân hàng là bắt buộc';
      if (!formData.bankAccountNumber?.trim()) newErrors.bankAccountNumber = 'Số tài khoản là bắt buộc';
      if (!formData.bankAccountHolder?.trim()) newErrors.bankAccountHolder = 'Chủ tài khoản là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue: any = value;
    // Nếu là gender thì parseInt
    if (name === 'gender') {
      newValue = parseInt(value, 10);
    }
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    // Handle address selections
    if (name === 'provinceCode') {
      setFormData(prev => ({ ...prev, districtCode: '', wardCode: '' }));
    } else if (name === 'districtCode') {
      setFormData(prev => ({ ...prev, wardCode: '' }));
    } else if (name === 'wardCode') {
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value) as UserRoleInteger;
    setFormData(prev => ({ ...prev, role: value }));
    if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, dob: new Date(e.target.value) }));
    if (errors.dob) setErrors(prev => ({ ...prev, dob: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Lấy tên từ code, ưu tiên đúng thứ tự: Địa chỉ chi tiết, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố
      const getNameByCode = (list: any[], code: string) => {
        if (!Array.isArray(list) || !code) return '';
        const found = list.find((item: any) => item.code?.toString() === code?.toString());
        return found?.name || '';
      };

      const wardName = getNameByCode(wards.data, String(formData.wardCode ?? ''));
      const districtName = getNameByCode(districts.data, String(formData.districtCode ?? ''));
      const provinceName = getNameByCode(provinces.data, String(formData.provinceCode ?? ''));

      const addressParts = [
        formData.streetAddress?.trim(),
        wardName?.trim(),
        districtName?.trim(),
        provinceName?.trim()
      ].filter(Boolean);

      const address = addressParts.join(', ');
      // Chỉ gửi các trường có giá trị, không gửi undefined/null
      const payload: any = {
        name: formData.name?.trim() || '',
        email: formData.email.trim(),
        password: formData.password.trim(),
        phoneNumber: formData.phoneNumber ? String(formData.phoneNumber) : '',
        address,
        gender: formData.gender as Gender, // đã validate bắt buộc chọn
        dob: formData.dob ? new Date(formData.dob).toISOString() : '',
        role: formData.role,
        // Đảm bảo luôn có 3 trường này, nếu không phải Seller thì truyền chuỗi rỗng
        shopName: formData.role === UserRoleInteger.SELLER ? (formData.shopName?.trim() || '') : '',
        shopDescription: formData.role === UserRoleInteger.SELLER ? (formData.shopDescription?.trim() || '') : '',
        businessType: formData.role === UserRoleInteger.SELLER ? (formData.businessType?.trim() || '') : '',
      };
      if (formData.role === UserRoleInteger.SELLER || formData.role === UserRoleInteger.SHIPPER) {
        payload.bankName = formData.bankName?.trim() || '';
        payload.bankAccountNumber = formData.bankAccountNumber?.trim() || '';
        payload.bankAccountHolder = formData.bankAccountHolder?.trim() || '';
      }
      const res = await UserSerice.adminCreateUser(payload as RegisterRequest);
      if (res?.data?.isSuccess) {
        helpers.notificationMessage(res.data.message || 'Tạo tài khoản thành công, vui lòng kiểm tra email để xác thực.', 'success');
        setFormData({
          name: '', email: '', password: '', phoneNumber: '',
          gender: undefined, dob: new Date(), role: undefined, shopName: '', shopDescription: '', businessType: '', bankName: '', bankAccountNumber: '', bankAccountHolder: '',
          provinceCode: '', districtCode: '', wardCode: '', streetAddress: '',
        });
        setErrors({});
        onSuccess();
        if (onAddUser) {
          const userData = res?.data?.data || {};
          onAddUser({
            id: userData.id?.toString() || '',
            name: userData.name || payload.name,
            email: userData.email || payload.email,
            phoneNumber: userData.phoneNumber ? String(userData.phoneNumber) : payload.phoneNumber,
            role: typeof userData.role === 'number' ? userData.role : (payload.role ?? 3),
          });
        }
      } else {
        helpers.notificationMessage(res?.data?.message || 'Có lỗi xảy ra khi tạo người dùng', 'error');
      }
    } catch (error: any) {
      helpers.notificationMessage(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng', 'error');
      setErrors({ submit: error?.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '', email: '', password: '', phoneNumber: '',
      gender: undefined, dob: new Date(), role: undefined, shopName: '', shopDescription: '', businessType: '', bankName: '', bankAccountNumber: '', bankAccountHolder: '',
      provinceCode: '', districtCode: '', wardCode: '', streetAddress: '',
    });
    setErrors({});
    setIsSubmitting(false);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleCancel();
  };

  // Helper cho react-select options giống register/index.tsx
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

  // Log options để debug
  console.log('Banks raw data:', banks);
  const bankOptions = getBankOptions(banks);
  console.log('Bank options for Select:', bankOptions);

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancel}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-3xl mx-auto"
          >
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Thêm Người Dùng Mới</h3>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
                {errors.submit && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-400 text-sm">{errors.submit}</p>
                    </div>
                  </motion.div>
                )}
                {/* Section 1: Thông tin cá nhân */}
                <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-amber-400 mb-4">Thông tin cá nhân</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Họ Và Tên</label>
                      <input ref={nameInputRef} type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} placeholder="Nhập tên..." disabled={isSubmitting} />
                      {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Email</label>
                      <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} placeholder="Nhập email..." disabled={isSubmitting} />
                      {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Mật khẩu</label>
                      <input type="password" name="password" value={formData.password || ''} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} placeholder="Nhập mật khẩu..." disabled={isSubmitting} />
                      {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Số điện thoại</label>
                      <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.phoneNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} placeholder="Nhập số điện thoại..." disabled={isSubmitting} />
                      {errors.phoneNumber && <p className="text-red-400 text-xs">{errors.phoneNumber}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Giới tính</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.gender ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`}
                        disabled={isSubmitting}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value={Gender.MALE}>Nam</option>
                        <option value={Gender.FEMALE}>Nữ</option>
                      </select>
                      {errors.gender && <p className="text-red-400 text-xs">{errors.gender}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Ngày sinh</label>
                      <input type="date" name="dob" value={formData.dob.toISOString().split('T')[0]} onChange={handleDateChange} className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.dob ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} disabled={isSubmitting} />
                      {errors.dob && <p className="text-red-400 text-xs">{errors.dob}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Vai trò</label>
                      <select name="role" value={formData.role === undefined ? '' : formData.role.toString()} onChange={handleRoleChange} required className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.role ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} disabled={isSubmitting}>
                        <option value="" disabled>Chọn vai trò người dùng</option>
                        <option value={UserRoleInteger.SELLER.toString()}>Nhân Viên Bán Hàng</option>
                        <option value={UserRoleInteger.SHIPPER.toString()}>Nhân Viên Giao Hàng</option>
                      </select>
                      {errors.role && <p className="text-red-400 text-xs">{errors.role}</p>}
                    </div>
                  {/* Địa chỉ: Tỉnh/Thành phố, Quận/Huyện, Phường/Xã, Địa chỉ chi tiết, Địa chỉ đầy đủ */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-2">
                    <div>
                      <label htmlFor="provinceCode" className="block text-sm font-medium text-gray-200">
                        Tỉnh/Thành phố
                      </label>
                      <div className="mt-1">
                        <select
                          id="provinceCode"
                          name="provinceCode"
                          value={formData.provinceCode}
                          onChange={handleInputChange}
                          className="appearance-none block w-full px-3 py-3 border border-gray-700 rounded-lg shadow-sm placeholder-gray-400 bg-gray-900/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        >
                          <option value="">Chọn tỉnh/thành phố</option>
                          {provinces.data?.map((province: { code: string | number, name: React.ReactNode }) => (
                            <option key={province.code} value={province.code}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="districtCode" className="block text-sm font-medium text-gray-200">
                        Quận/Huyện
                      </label>
                      <div className="mt-1">
                        <select
                          id="districtCode"
                          name="districtCode"
                          value={formData.districtCode}
                          onChange={handleInputChange}
                          disabled={!formData.provinceCode}
                          className="appearance-none block w-full px-3 py-3 border border-gray-700 rounded-lg shadow-sm placeholder-gray-400 bg-gray-900/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Chọn quận/huyện</option>
                          {districts.data?.map((district: { code: string | number, name: React.ReactNode }) => (
                            <option key={district.code} value={district.code}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="wardCode" className="block text-sm font-medium text-gray-200">
                        Phường/Xã
                      </label>
                      <div className="mt-1">
                        <select
                          id="wardCode"
                          name="wardCode"
                          value={formData.wardCode}
                          onChange={handleInputChange}
                          disabled={!formData.districtCode}
                          className="appearance-none block w-full px-3 py-3 border border-gray-700 rounded-lg shadow-sm placeholder-gray-400 bg-gray-900/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Chọn phường/xã</option>
                          {wards.data?.map((ward: { code: string | number; name: React.ReactNode }) => (
                            <option key={ward.code} value={ward.code}>
                              {ward.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-200">
                      Địa chỉ chi tiết
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="streetAddress"
                        name="streetAddress"
                        type="text"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-700 rounded-lg shadow-sm placeholder-gray-400 bg-gray-900/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Số nhà, tên đường..."
                      />
                      <div className="absolute left-3 top-3.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {previewAddress && (
                    <div className="rounded-lg bg-gray-800/30 border border-gray-700 p-3 col-span-2">
                      <p className="text-sm text-gray-300">
                        <span className="text-xs font-medium text-amber-400">Địa chỉ đầy đủ:</span> {previewAddress}
                      </p>
                    </div>
                  )}
                  </div>
                </div>
                {/* Section 2: Thông tin bán hàng */}
                {formData.role === UserRoleInteger.SELLER && (
                  <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-amber-400 mb-4">Thông tin bán hàng</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Tên cửa hàng</label>
                          <input type="text" name="shopName" value={formData.shopName || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 border-gray-700 focus:border-amber-500 focus:ring-amber-500/20" placeholder="Nhập tên cửa hàng..." disabled={isSubmitting} />
                          {errors.shopName && <p className="text-red-400 text-xs">{errors.shopName}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Loại hình kinh doanh</label>
                          <select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-200 border-gray-700 focus:border-amber-500 focus:ring-amber-500/20"
                            disabled={isSubmitting}
                          >
                            <option value="">Chọn loại hình kinh doanh</option>
                            <option value="motorcycle-parts">Phụ tùng xe máy</option>
                            <option value="motorcycle-accessories">Phụ kiện xe máy</option>
                            <option value="motorcycle-maintenance">Bảo dưỡng sửa chữa</option>
                            <option value="motorcycle-sales">Mua bán xe máy</option>
                            <option value="motorcycle-rental">Cho thuê xe máy</option>
                            <option value="other">Khác</option>
                          </select>
                          {errors.businessType && <p className="text-red-400 text-xs">{errors.businessType}</p>}
                        </div>
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Mô tả cửa hàng</label>
                        <CourseraEditor
                          id="shopDescription"
                          value={formData.shopDescription || ''}
                          onChange={value => setFormData(prev => ({ ...prev, shopDescription: value }))}
                          placeholder="Mô tả về cửa hàng, sản phẩm và dịch vụ của bạn..."
                          className="w-full"
                          disabled={isSubmitting}
                        />
                        {errors.shopDescription && <p className="text-red-400 text-xs">{errors.shopDescription}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {/* Section 3: Thông tin Ngân hàng */}
                {(formData.role === UserRoleInteger.SELLER || formData.role === UserRoleInteger.SHIPPER) && (
                  <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-amber-400 mb-4">Thông tin Ngân hàng</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Số tài khoản</label>
                        <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber || ''} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.bankAccountNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} placeholder="Nhập số tài khoản..." disabled={isSubmitting} />
                        {errors.bankAccountNumber && <p className="text-red-400 text-xs">{errors.bankAccountNumber}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Chủ tài khoản</label>
                        <input type="text" name="bankAccountHolder" value={formData.bankAccountHolder || ''} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.bankAccountHolder ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} placeholder="Nhập tên chủ tài khoản..." disabled={isSubmitting} />
                        {errors.bankAccountHolder && <p className="text-red-400 text-xs">{errors.bankAccountHolder}</p>}
                      </div>
                    </div>
                    <div className="md:col-span-2 mt-4">
                      <label htmlFor="bankName" className="block text-sm font-medium text-gray-200">
                        Tên ngân hàng <span className="text-red-400">*</span>
                      </label>
                      <div className="mt-1">
                        <Select
                          inputId="bankName"
                          name="bankName"
                          options={getBankOptions(banks)}
                          value={getBankOptions(banks).find((opt: { value: string }) => opt.value === formData.bankName) || null}
                          onChange={option => setFormData(prev => ({ ...prev, bankName: option?.value || '' }))}
                          isLoading={isLoadingBanks}
                          placeholder={isLoadingBanks ? 'Đang tải danh sách ngân hàng...' : 'Chọn ngân hàng'}
                          classNamePrefix="react-select"
                          styles={{
                            option: (provided) => ({ ...provided, display: 'flex', alignItems: 'center', gap: 8 }),
                            singleValue: (provided) => ({ ...provided, display: 'flex', alignItems: 'center', gap: 8 }),
                          }}
                          isClearable
                          noOptionsMessage={() => 'Không tìm thấy ngân hàng'}
                          menuPlacement="top"
                        />
                      </div>
                      {errors.bankName && <p className="text-red-400 text-xs">{errors.bankName}</p>}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 pt-2">
                  <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors" disabled={isSubmitting}>Hủy</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60" disabled={isSubmitting}>{isSubmitting ? 'Đang tạo...' : 'Tạo người dùng'}</button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 
