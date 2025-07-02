import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserSerice } from '@services/user/user.service';
import type { UserSearchItem } from '../../../types/user/User.res.type';
import { helpers } from '@utils/index.ts';

interface UpdateUserModalProps {
  user: UserSearchItem;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: UserSearchItem) => void;
}

export const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ user, open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    phoneNumber: user.phoneNumber || '',
    address: '',
    avatarUrl: user.avatarUrl || '',
    dob: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch detail if missing address or dob
  useEffect(() => {
    if (open) {
      if (!user.address || !user.dob) {
        setFetching(true);
        UserSerice.getUserById(user.id)
          .then(res => {
            const detail = res.data.data;
            setFormData({
              name: detail.name || '',
              phoneNumber: detail.phoneNumber || '',
              address: detail.address || '',
              avatarUrl: detail.avatarUrl || '',
              dob: detail.dob ? detail.dob.split('T')[0] : '',
            });
          })
          .catch(() => setError('Không thể tải thông tin chi tiết'))
          .finally(() => setFetching(false));
      } else {
        setFormData({
          name: user.name || '',
          phoneNumber: user.phoneNumber || '',
          address: user.address || '',
          avatarUrl: user.avatarUrl || '',
          dob: user.dob ? user.dob.split('T')[0] : '',
        });
      }
      setError(null);
    }
  }, [open, user.address, user.dob, user.name, user.phoneNumber, user.avatarUrl, user.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        id: user.id,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        avatarUrl: formData.avatarUrl,
        dob: formData.dob ? new Date(formData.dob).toISOString() : undefined,
      };
      await UserSerice.updateUser(user.id, payload);
      helpers.notificationMessage('Cập nhật thông tin người dùng thành công!', 'success');
      onSuccess({ ...user, ...payload });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

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
        transition={{ type: 'spring', damping: 20 }}
        className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="border-b border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Cập nhật người dùng</h2>
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
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {fetching ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">Họ và tên</label>
              <input
                type="text"
                name="name"
                className="input-primary w-full"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Số điện thoại</label>
              <input
                type="text"
                name="phoneNumber"
                className="input-primary w-full"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Địa chỉ</label>
              <input
                type="text"
                name="address"
                className="input-primary w-full"
                value={formData.address}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Ngày sinh</label>
              <input
                type="date"
                name="dob"
                className="input-primary w-full"
                value={formData.dob}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {/* Avatar upload can be added here if needed */}
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
                disabled={isLoading}
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
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
