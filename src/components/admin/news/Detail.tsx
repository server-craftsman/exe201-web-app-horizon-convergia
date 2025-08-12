import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../../../hooks/modules/useNews';
import { helpers } from '@utils/index';

interface NewsDetailProps {
  newsId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NewsDetail = ({ newsId, isOpen, onClose }: NewsDetailProps) => {
  const { useGetNewsById } = useNews();
  const { data: newsDetail, isLoading, error } = useGetNewsById(newsId);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Chi tiết tin tức</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="mt-2 text-gray-300">Đang tải...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">Có lỗi xảy ra khi tải thông tin tin tức</p>
            </div>
          ) : newsDetail?.data ? (
            <div className="space-y-6">
              {/* Image */}
              <div className="text-center">
                <img
                  src={newsDetail.data.imageUrl}
                  alt={newsDetail.data.title}
                  className="max-w-full h-auto rounded-lg mx-auto"
                  style={{ maxHeight: '400px' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>

              {/* Title */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{newsDetail.data.title}</h3>
              </div>

              {/* Meta information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-700 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-300">ID</label>
                  <p className="text-white font-mono text-sm">{newsDetail.data.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Trạng thái</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    newsDetail.data.isDeleted 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {newsDetail.data.isDeleted ? 'Đã xóa' : 'Hoạt động'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Ngày tạo</label>
                  <p className="text-white">{helpers.formatDate(new Date(newsDetail.data.createdAt))}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Ngày cập nhật</label>
                  <p className="text-white">{helpers.formatDate(new Date(newsDetail.data.updatedAt))}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">ID tác giả</label>
                  <p className="text-white font-mono text-sm">{newsDetail.data.authorId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">ID danh mục</label>
                  <p className="text-white font-mono text-sm">{newsDetail.data.categoryId}</p>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nội dung</label>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="text-white whitespace-pre-wrap">
                    {newsDetail.data.content}
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL hình ảnh</label>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <a 
                    href={newsDetail.data.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 break-all"
                  >
                    {newsDetail.data.imageUrl}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Không tìm thấy thông tin tin tức</p>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
