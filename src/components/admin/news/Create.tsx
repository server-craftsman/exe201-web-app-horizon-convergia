import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreateNewsRequest } from '../../../types/news/News.req.type';
import { helpers } from '@utils/index';
import { useNews } from '../../../hooks/modules/useNews';
import { useCategory } from '../../../hooks/modules/useCategory';
import CourseraEditor from '../../common/CourseraEditor';

interface CreateNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateNewsModal = ({ isOpen, onClose }: CreateNewsModalProps) => {
  const [formData, setFormData] = useState<CreateNewsRequest>({
    title: '',
    content: '',
    imageUrl: '',
    categoryId: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { createNews } = useNews();
  const { useGetAllCategories } = useCategory();
  const { data: categories } = useGetAllCategories();

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title?.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    
    // Kiểm tra nội dung
    if (!formData.content?.trim()) newErrors.content = 'Nội dung là bắt buộc';
    
    if (!formData.imageUrl?.trim()) newErrors.imageUrl = 'URL hình ảnh là bắt buộc';
    if (!formData.categoryId?.trim()) newErrors.categoryId = 'Danh mục là bắt buộc';
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await createNews.mutateAsync(formData);
      helpers.notificationMessage('Tạo tin tức thành công!', 'success');
      onClose();
      // Reset form
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        categoryId: '',
      });
      
      // Delay reload để user có thể thấy thông báo success
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error creating news:', error);
      helpers.notificationMessage(
        error?.response?.data?.message || 'Có lỗi xảy ra khi tạo tin tức',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      categoryId: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Thêm tin tức mới</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tiêu đề *
              </label>
              <input
                ref={titleInputRef}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tiêu đề tin tức"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL hình ảnh *
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {errors.imageUrl && <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>}
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Danh mục *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn danh mục</option>
                {categories?.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nội dung *
              </label>
              
              <CourseraEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="Nhập nội dung tin tức..."
                className="w-full"
              />
              
              {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
              <p className="mt-1 text-xs text-gray-400">
                💡 <strong>Rich Text Editor:</strong> Sử dụng toolbar để format text • Hỗ trợ đầy đủ formatting options
              </p>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang tạo...' : 'Tạo tin tức'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
