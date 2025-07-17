import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RegisterRequest } from '../../../types/user/User.req.type';
import { helpers } from '@utils/index';
import { UserSerice } from '@services/user/user.service';
import Select from 'react-select';
import { useBank } from '../../../hooks/other/useBank';
import { UserRoleInteger } from '../../../app/enums/userRole.enum';


interface AddUserModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  onAddUser?: (user: { id: string; name?: string; email: string; phoneNumber?: string; role: number }) => void;
}

export const AddUserModal = ({ open, onCancel, onSuccess, onAddUser }: AddUserModalProps) => {
  const [formData, setFormData] = useState<RegisterRequest & { role: UserRoleInteger | undefined }>({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    gender: 0,
    dob: new Date(),
    role: undefined, // undefined means not selected
    shopName: '',
    shopDescription: '',
    businessType: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountHolder: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { banks, isLoading: isLoadingBanks } = useBank();

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
    if (!formData.address?.trim()) newErrors.address = 'Địa chỉ là bắt buộc';
    if (!formData.dob) newErrors.dob = 'Ngày sinh là bắt buộc';
    if (formData.gender === undefined || formData.gender === null) newErrors.gender = 'Giới tính là bắt buộc';
    if (formData.role === undefined) newErrors.role = 'Vai trò là bắt buộc';
    if (!formData.shopName?.trim()) newErrors.shopName = 'Tên shop là bắt buộc';
    if (!formData.shopDescription?.trim()) newErrors.shopDescription = 'Mô tả shop là bắt buộc';
    if (!formData.businessType?.trim()) newErrors.businessType = 'Loại hình kinh doanh là bắt buộc';
    if (!formData.bankName?.trim()) newErrors.bankName = 'Tên ngân hàng là bắt buộc';
    if (!formData.bankAccountNumber?.trim()) newErrors.bankAccountNumber = 'Số tài khoản là bắt buộc';
    if (!formData.bankAccountHolder?.trim()) newErrors.bankAccountHolder = 'Chủ tài khoản là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, gender: Number(e.target.value) }));
    if (errors.gender) setErrors(prev => ({ ...prev, gender: '' }));
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
      const payload = {
        ...formData,
        role: formData.role, // already correct type
        dob: formData.dob ? new Date(formData.dob).toISOString() : '',
        phoneNumber: formData.phoneNumber ? String(formData.phoneNumber) : '',
        address: formData.address || '',
        name: formData.name || '',
        email: formData.email || '',
        password: formData.password || '',
        shopName: formData.shopName || '',
        shopDescription: formData.shopDescription || '',
        businessType: formData.businessType || '',
        bankName: formData.bankName || '',
        bankAccountNumber: formData.bankAccountNumber || '',
        bankAccountHolder: formData.bankAccountHolder || '',
      };
      const res = await UserSerice.adminCreateUser(payload as unknown as RegisterRequest);
      helpers.notificationMessage('Tạo người dùng thành công!', 'success');
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
      setFormData({
        name: '', email: '', password: '', phoneNumber: '', address: '', gender: 0, dob: new Date(), role: undefined, shopName: '', shopDescription: '', businessType: '', bankName: '', bankAccountNumber: '', bankAccountHolder: ''
      });
      setErrors({});
      onSuccess();
    } catch (error: any) {
      helpers.notificationMessage(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng', 'error');
      setErrors({ submit: error?.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '', email: '', password: '', phoneNumber: '', address: '', gender: 0, dob: new Date(), role: undefined, shopName: '', shopDescription: '', businessType: '', bankName: '', bankAccountNumber: '', bankAccountHolder: ''
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
            className="relative w-full max-w-2xl mx-auto"
          >
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
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
                      <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Tên</label>
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
                      <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Địa chỉ</label>
                      <input type="text" name="address" value={formData.address || ''} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} placeholder="Nhập địa chỉ..." disabled={isSubmitting} />
                      {errors.address && <p className="text-red-400 text-xs">{errors.address}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Giới tính</label>
                      <div className="flex gap-4 mt-1">
                        <label className="inline-flex items-center">
                          <input type="radio" name="gender" value={0} checked={formData.gender === 0} onChange={handleGenderChange} className="form-radio text-amber-500" disabled={isSubmitting} />
                          <span className="ml-2 text-white">Nam</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="gender" value={1} checked={formData.gender === 1} onChange={handleGenderChange} className="form-radio text-amber-500" disabled={isSubmitting} />
                          <span className="ml-2 text-white">Nữ</span>
                        </label>
                      </div>
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
                        <option value={UserRoleInteger.SELLER.toString()}>Seller</option>
                        <option value={UserRoleInteger.SHIPPER.toString()}>Shipper</option>
                      </select>
                      {errors.role && <p className="text-red-400 text-xs">{errors.role}</p>}
                    </div>
                  </div>
                </div>
                {/* Section 2: Thông tin bán hàng */}
                {formData.role === UserRoleInteger.SELLER && (
                  <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-amber-400 mb-4">Thông tin bán hàng</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Tên shop</label>
                        <input type="text" name="shopName" value={formData.shopName || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 border-gray-700 focus:border-amber-500 focus:ring-amber-500/20" placeholder="Nhập tên shop..." disabled={isSubmitting} />
                        {errors.shopName && <p className="text-red-400 text-xs">{errors.shopName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Mô tả shop</label>
                        <textarea name="shopDescription" value={formData.shopDescription || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 border-gray-700 focus:border-amber-500 focus:ring-amber-500/20" placeholder="Nhập mô tả shop..." disabled={isSubmitting} />
                        {errors.shopDescription && <p className="text-red-400 text-xs">{errors.shopDescription}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300"><span className="text-red-400">*</span> Loại hình kinh doanh</label>
                        <input type="text" name="businessType" value={formData.businessType || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 border-gray-700 focus:border-amber-500 focus:ring-amber-500/20" placeholder="Nhập loại hình kinh doanh..." disabled={isSubmitting} />
                        {errors.businessType && <p className="text-red-400 text-xs">{errors.businessType}</p>}
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