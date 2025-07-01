import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RegisterRequest } from '../../../types/user/User.req.type';
import { helpers } from '@utils/index';
import { UserSerice } from '@services/user/user.service';

interface AddUserModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  onAddUser?: (user: { id: string; name?: string; email: string; phoneNumber?: string; role: number }) => void;
}

export const AddUserModal = ({ open, onCancel, onSuccess, onAddUser }: AddUserModalProps) => {
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    gender: 0,
    dob: '',
    role: 3,
    shopName: '',
    shopDescription: '',
    businessType: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [open]);

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name?.trim()) newErrors.name = 'Tên không được để trống';
    if (!formData.email?.trim()) newErrors.email = 'Email không được để trống';
    if (!formData.password?.trim()) newErrors.password = 'Mật khẩu không được để trống';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Số điện thoại không được để trống';
    if (!formData.address?.trim()) newErrors.address = 'Địa chỉ không được để trống';
    if (!formData.dob) newErrors.dob = 'Ngày sinh không được để trống';
    if (formData.role === undefined || formData.role === null) newErrors.role = 'Vai trò không được để trống';
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
    setFormData(prev => ({ ...prev, role: Number(e.target.value) }));
    if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, dob: e.target.value }));
    if (errors.dob) setErrors(prev => ({ ...prev, dob: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        dob: formData.dob ? new Date(formData.dob).toISOString() : '',
        phoneNumber: formData.phoneNumber ? String(formData.phoneNumber) : '',
        address: formData.address || '',
        name: formData.name || '',
        email: formData.email || '',
        password: formData.password || '',
        shopName: formData.shopName || '',
        shopDescription: formData.shopDescription || '',
        businessType: formData.businessType || '',
      };
      const res = await UserSerice.adminCreateUser(payload);
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
        name: '', email: '', password: '', phoneNumber: '', address: '', gender: 0, dob: '', role: 3, shopName: '', shopDescription: '', businessType: ''
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
      name: '', email: '', password: '', phoneNumber: '', address: '', gender: 0, dob: '', role: 3, shopName: '', shopDescription: '', businessType: ''
    });
    setErrors({});
    setIsSubmitting(false);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleCancel();
  };

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
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
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
              <form onSubmit={handleSubmit} className="p-4 space-y-2">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Tên <span className="text-red-400">*</span></label>
                    <input ref={nameInputRef} type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} placeholder="Nhập tên..." disabled={isSubmitting} />
                    {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Email <span className="text-red-400">*</span></label>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} placeholder="Nhập email..." disabled={isSubmitting} />
                    {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Mật khẩu <span className="text-red-400">*</span></label>
                    <input type="password" name="password" value={formData.password || ''} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} placeholder="Nhập mật khẩu..." disabled={isSubmitting} />
                    {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Số điện thoại <span className="text-red-400">*</span></label>
                    <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.phoneNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} placeholder="Nhập số điện thoại..." disabled={isSubmitting} />
                    {errors.phoneNumber && <p className="text-red-400 text-xs">{errors.phoneNumber}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Địa chỉ <span className="text-red-400">*</span></label>
                    <input type="text" name="address" value={formData.address || ''} onChange={handleInputChange} className={`w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} placeholder="Nhập địa chỉ..." disabled={isSubmitting} />
                    {errors.address && <p className="text-red-400 text-xs">{errors.address}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Giới tính <span className="text-red-400">*</span></label>
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
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Ngày sinh <span className="text-red-400">*</span></label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleDateChange} className={`w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.dob ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} disabled={isSubmitting} />
                    {errors.dob && <p className="text-red-400 text-xs">{errors.dob}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Vai trò <span className="text-red-400">*</span></label>
                    <select name="role" value={formData.role} onChange={handleRoleChange} className={`w-full px-4 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.role ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'}`} disabled={isSubmitting}>
                      {/* <option value={0}>Admin</option> */}
                      <option value={1}>Seller</option>
                      <option value={2}>Shipper</option>
                      {/* <option value={3}>Buyer</option> */}
                    </select>
                    {errors.role && <p className="text-red-400 text-xs">{errors.role}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Tên shop</label>
                    <input type="text" name="shopName" value={formData.shopName || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 border-gray-700 focus:border-amber-500 focus:ring-amber-500/20" placeholder="Nhập tên shop..." disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Mô tả shop</label>
                    <textarea name="shopDescription" value={formData.shopDescription || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 border-gray-700 focus:border-amber-500 focus:ring-amber-500/20" placeholder="Nhập mô tả shop..." disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Loại hình kinh doanh</label>
                    <input type="text" name="businessType" value={formData.businessType || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 border-gray-700 focus:border-amber-500 focus:ring-amber-500/20" placeholder="Nhập loại hình kinh doanh..." disabled={isSubmitting} />
                  </div>
                </div>
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