import { useEffect, useState } from 'react';
import { UserSerice } from '@services/user/user.service';
import type { UserInfo } from '../../../types/user/User.res.type';
import { motion } from 'framer-motion';
import { MdEmail, MdPhone, MdLocationOn, MdCake, MdPerson, MdCalendarToday, MdUpdate, MdStoreMallDirectory } from 'react-icons/md';

interface DetailProps {
  userId: string;
  onBack?: () => void;
}

export const Detail: React.FC<DetailProps> = ({ userId, onBack }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    UserSerice.getUserById(userId)
      .then(res => {
        if (res.data.isSuccess) setUser(res.data.data);
        else setError(res.data.message || 'Không tìm thấy người dùng');
      })
      .catch(() => setError('Lỗi khi tải thông tin người dùng'))
      .finally(() => setLoading(false));
  }, [userId]);

  const getRoleLabel = (role: number | string | null) => {
    if (role === 0 || role === 'Admin') return 'Admin';
    if (role === 1 || role === 'Seller') return 'Seller';
    if (role === 2 || role === 'Shipper') return 'Shipper';
    if (role === 3 || role === 'Buyer') return 'Buyer';
    return 'Unknown';
  };
  const getStatusLabel = (status: number | null) => {
    if (status === 0) return 'Active';
    if (status === 1) return 'Inactive';
    if (status === 2) return 'Blocked';
    return 'Unknown';
  };
  const getStatusColor = (status: number | null) => {
    if (status === 0) return 'bg-green-500/20 text-green-400';
    if (status === 1) return 'bg-yellow-500/20 text-yellow-400';
    if (status === 2) return 'bg-red-500/20 text-red-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full bg-gray-800/90 border border-gray-700 rounded-2xl shadow-2xl p-0 md:p-14">
        <button
          onClick={onBack}
          className="mb-8 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
        >
          ← Quay lại
        </button>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12">{error}</div>
        ) : user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-12 items-center"
          >
            {/* Top: Avatar & Main Info */}
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-6xl text-white font-bold shadow-lg">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name || 'avatar'} className="w-full h-full object-cover rounded-full" />
                ) : (
                  user.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-0">{user.name}</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>{getStatusLabel(user.status)}</span>
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400">{getRoleLabel(user.role)}</span>
                {user.isVerified && <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">Đã xác thực</span>}
              </div>
            </div>
            {/* Details Section */}
            <div className="flex-1 w-full">
              <div className="flex flex-col gap-7">
                <div className="flex items-center gap-4">
                  <MdEmail className="w-6 h-6 text-amber-400" />
                  <span className="text-gray-400 text-base min-w-[90px]">Email:</span>
                  <span className="text-white text-base font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <MdPhone className="w-6 h-6 text-green-400" />
                  <span className="text-gray-400 text-base min-w-[90px]">SĐT:</span>
                  <span className="text-white text-base font-medium">{user.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-4">
                  <MdPerson className="w-6 h-6 text-blue-400" />
                  <span className="text-gray-400 text-base min-w-[90px]">Giới tính:</span>
                  <span className="text-white text-base font-medium">{user.gender === 1 ? 'Nam' : user.gender === 2 ? 'Nữ' : 'Khác'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <MdCake className="w-6 h-6 text-pink-400" />
                  <span className="text-gray-400 text-base min-w-[90px]">Ngày sinh:</span>
                  <span className="text-white text-base font-medium">{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <MdLocationOn className="w-6 h-6 text-gray-400" />
                  <span className="text-gray-400 text-base min-w-[90px]">Địa chỉ:</span>
                  <span className="text-white text-base font-medium">{user.address}</span>
                </div>
                <div className="flex items-center gap-4">
                  <MdCalendarToday className="w-6 h-6 text-amber-400" />
                  <span className="text-gray-400 text-base min-w-[90px]">Ngày tạo:</span>
                  <span className="text-white text-base font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <MdUpdate className="w-6 h-6 text-amber-400" />
                  <span className="text-gray-400 text-base min-w-[90px]">Ngày cập nhật:</span>
                  <span className="text-white text-base font-medium">{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A'}</span>
                </div>
              </div>
              {user.shopName && (
                <>
                  <hr className="my-8 border-gray-700" />
                  <div>
                    <h3 className="text-amber-400 font-semibold mb-4 text-xl flex items-center gap-2">
                      <MdStoreMallDirectory className="w-7 h-7 text-amber-400" />
                      Thông tin shop
                    </h3>
                    <div className="flex flex-col gap-5">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-base min-w-[120px]">Tên shop:</span>
                        <span className="text-white text-base font-medium">{user.shopName}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-base min-w-[120px]">Mô tả:</span>
                        <span className="text-white text-base font-medium">{user.shopDescription}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-base min-w-[120px]">Loại hình kinh doanh:</span>
                        <span className="text-white text-base font-medium">{user.businessType}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};
