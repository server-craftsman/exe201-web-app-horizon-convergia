import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';
import { BaseService } from '../../../app/api/base.service';

interface UpdateComProps {
    open: boolean;
    category: ICategory | null;
    recordId: string;
    onCancel: () => void;
    onSuccess: () => void;
    updateCategory: any;
}

export const UpdateCom = ({ open, category, recordId, onCancel, onSuccess, updateCategory }: UpdateComProps) => {
    const [formData, setFormData] = useState({
        name: '',
        imageUrl: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Load category data when modal opens
    useEffect(() => {
        if (open && category) {
            setFormData({ name: category.name || '', imageUrl: (category as any).imageUrl || '' });
            setErrors({});
            if (nameInputRef.current) {
                nameInputRef.current.focus();
            }
        }
    }, [open, category]);

    const validateForm = useCallback(() => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên danh mục không được để trống';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Tên danh mục phải có ít nhất 2 ký tự';
        } else if (formData.name.trim().length > 50) {
            newErrors.name = 'Tên danh mục không được vượt quá 50 ký tự';
        }

        if (!formData.imageUrl) {
            newErrors.imageUrl = 'Vui lòng tải lên hình ảnh danh mục';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const handleUploadImage = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploadingImage(true);
        const url = await BaseService.uploadFile(files[0], 'image');
        if (url) {
            setFormData(prev => ({ ...prev, imageUrl: url }));
        } else {
            setErrors(prev => ({ ...prev, imageUrl: 'Tải ảnh thất bại' }));
        }
        setUploadingImage(false);
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Check if there are any changes
        if (category && formData.name.trim() === category.name && formData.imageUrl === (category as any).imageUrl) {
            setErrors({ submit: 'Không có thay đổi nào để cập nhật' });
            return;
        }

        setIsSubmitting(true);
        try {
            await updateCategory.mutateAsync({
                id: recordId,
                params: {
                    name: formData.name.trim(),
                    imageUrl: formData.imageUrl
                }
            });
            setFormData({ name: '', imageUrl: '' });
            setErrors({});
            onSuccess();
        } catch (error: any) {
            if (error?.response?.data?.message) {
                setErrors({ submit: error.response.data.message });
            } else {
                setErrors({ submit: 'Có lỗi xảy ra khi cập nhật danh mục' });
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validateForm, updateCategory, recordId, category, onSuccess]);

    const handleCancel = useCallback(() => {
        setFormData({ name: '', imageUrl: '' });
        setErrors({});
        setIsSubmitting(false);
        onCancel();
    }, [onCancel]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleCancel();
        }
    }, [handleCancel]);

    const hasChanges = category && (formData.name.trim() !== category.name || formData.imageUrl !== (category as any).imageUrl);

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
                        transition={{ type: "spring", duration: 0.3 }}
                        className="relative w-full max-w-md mx-auto"
                    >
                        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">
                                                Chỉnh Sửa Danh Mục
                                            </h3>
                                            {category && (
                                                <p className="text-blue-100 text-sm">
                                                    ID: {category.id.slice(0, 8)}...
                                                </p>
                                            )}
                                        </div>
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
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Submit Error */}
                                {errors.submit && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-red-400 text-sm">{errors.submit}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Changes Indicator */}
                                {hasChanges && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-blue-400 text-sm">Có thay đổi chưa được lưu</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                        Tên danh mục <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            ref={nameInputRef}
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Nhập tên danh mục..."
                                            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.name
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : hasChanges
                                                    ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500/20'
                                                    : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
                                                }`}
                                            maxLength={50}
                                            disabled={isSubmitting}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <span className="text-xs text-gray-500">
                                                {formData.name.length}/50
                                            </span>
                                        </div>
                                    </div>
                                    {errors.name && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-400 text-sm flex items-center gap-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {errors.name}
                                        </motion.p>
                                    )}
                                    {category && (
                                        <p className="text-gray-500 text-xs">
                                            Tên hiện tại: <span className="text-gray-400">{category.name}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Hình ảnh *</label>
                                    {formData.imageUrl && (
                                        <img src={formData.imageUrl} alt="preview" className="h-24 w-24 object-cover rounded-lg mb-2" />
                                    )}
                                    <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e.target.files)} disabled={uploadingImage || isSubmitting} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300" />
                                    {errors.imageUrl && <p className="text-red-400 text-sm">{errors.imageUrl}</p>}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formData.name.trim() || !hasChanges}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang cập nhật...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Cập nhật
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};