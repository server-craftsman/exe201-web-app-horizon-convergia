import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';
import { BaseService } from '../../../app/api/base.service';

interface CreateComProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    createCategory: any;
    categories: ICategory[];
}

export const CreateCom = ({ open, onCancel, onSuccess, createCategory, categories }: CreateComProps) => {
    const [formData, setFormData] = useState({
        name: '',
        imageUrl: '',
        parentCategoryId: null as string | null
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const dropzoneRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Custom dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [open]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const validateForm = useCallback(() => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên danh mục không được để trống';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Tên danh mục phải có ít nhất 2 ký tự';
        } else if (formData.name.trim().length > 50) {
            newErrors.name = 'Tên danh mục không được vượt quá 50 ký tự';
        }

        // No imageUrl required validation (file upload is optional)

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

    const handleSelectCategory = useCallback((categoryId: string | null) => {
        setFormData(prev => ({ ...prev, parentCategoryId: categoryId }));
        setIsDropdownOpen(false);
        if (errors.parentCategoryId) {
            setErrors(prev => ({ ...prev, parentCategoryId: '' }));
        }
    }, [errors]);

    const getSelectedCategoryName = () => {
        if (!formData.parentCategoryId) return '-- Chọn danh mục cha (để trống nếu là gốc) --';
        const category = categories.find(cat => cat.id === formData.parentCategoryId);
        return category ? category.name : 'Không rõ';
    };

    const handleUploadImage = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploadingImage(true);
        const url = await BaseService.uploadFile(files[0], 'image', false);
        if (url) {
            setFormData(prev => ({ ...prev, imageUrl: url }));
        } else {
            setErrors(prev => ({ ...prev, imageUrl: 'Tải ảnh thất bại' }));
        }
        setUploadingImage(false);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (isSubmitting || uploadingImage) return;
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await handleFileValidationAndUpload(files[0]);
        }
    };

    const handleFileValidationAndUpload = async (file: File) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, imageUrl: 'Chỉ hỗ trợ JPG, PNG, WEBP' }));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, imageUrl: 'Dung lượng tối đa 5MB' }));
            return;
        }
        setErrors(prev => ({ ...prev, imageUrl: '' }));
        await handleUploadImage({ 0: file, length: 1 } as any);
    };

    const handleDropzoneClick = () => {
        if (!isSubmitting && !uploadingImage && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await createCategory.mutateAsync({
                name: formData.name.trim(),
                imageUrl: formData.imageUrl,
                parentCategoryId: formData.parentCategoryId
            });
            setFormData({ name: '', imageUrl: '', parentCategoryId: null });
            setErrors({});
            onSuccess();
        } catch (error: any) {
            if (error?.response?.data?.message) {
                setErrors({ submit: error.response.data.message });
            } else {
                setErrors({ submit: 'Có lỗi xảy ra khi tạo danh mục' });
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validateForm, createCategory, onSuccess]);

    const handleCancel = useCallback(() => {
        setFormData({ name: '', imageUrl: '', parentCategoryId: null });
        setErrors({});
        setIsSubmitting(false);
        onCancel();
    }, [onCancel]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleCancel();
        }
    }, [handleCancel]);

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
                            <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">
                                            Tạo Danh Mục Mới
                                        </h3>
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
                                                : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500/20'
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
                                </div>

                                {/* Parent Category Selector */}
                                <div className="space-y-2">
                                    <label htmlFor="parentCategoryId" className="block text-sm font-medium text-gray-300">
                                        Danh mục cha
                                    </label>
                                    <div className="relative">
                                        <div
                                            ref={dropdownRef}
                                            className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-500/20 transition-all duration-200 max-h-48 overflow-y-auto ${isDropdownOpen ? 'border-amber-500 focus:border-amber-500 focus:ring-amber-500/20' : ''}`}
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
                                            tabIndex={0}
                                            aria-label="Danh mục cha"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{getSelectedCategoryName()}</span>
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        {isDropdownOpen && (
                                            <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                                                <div
                                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${!formData.parentCategoryId ? 'bg-amber-500/20 text-amber-400' : ''}`}
                                                    onClick={() => handleSelectCategory(null)}
                                                >
                                                    -- Chọn danh mục cha (để trống nếu là gốc) --
                                                </div>
                                                {categories.map(cat => (
                                                    <div
                                                        key={cat.id}
                                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${cat.id === formData.parentCategoryId ? 'bg-amber-500/20 text-amber-400' : ''}`}
                                                        onClick={() => handleSelectCategory(cat.id)}
                                                    >
                                                        {cat.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.parentCategoryId && <p className="text-red-400 text-sm mt-1">{errors.parentCategoryId}</p>}
                                </div>

                                {/* Custom scrollbar styles for the dropdown */}
                                <style>
                                    {`
                                        .max-h-60::-webkit-scrollbar {
                                            width: 8px;
                                        }
                                        .max-h-60::-webkit-scrollbar-track {
                                            background: #374151;
                                            border-radius: 4px;
                                        }
                                        .max-h-60::-webkit-scrollbar-thumb {
                                            background: #f59e42;
                                            border-radius: 4px;
                                        }
                                        .max-h-60::-webkit-scrollbar-thumb:hover {
                                            background: #d97706;
                                        }
                                    `}
                                </style>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Hình Ảnh Danh Mục <span className="text-gray-400 text-xs">(không bắt buộc)</span>
                                    </label>
                                    <div
                                        ref={dropzoneRef}
                                        className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer bg-gray-800/80 hover:border-amber-400 ${formData.imageUrl ? 'py-4' : 'py-12'} ${uploadingImage ? 'opacity-70 pointer-events-none' : ''}`}
                                        onClick={handleDropzoneClick}
                                        onDragOver={e => { e.preventDefault(); e.stopPropagation(); dropzoneRef.current?.classList.add('border-amber-400'); }}
                                        onDragLeave={e => { e.preventDefault(); e.stopPropagation(); dropzoneRef.current?.classList.remove('border-amber-400'); }}
                                        onDrop={handleDrop}
                                        tabIndex={0}
                                        aria-label="Kéo thả hoặc nhấp để tải lên"
                                    >
                                        {formData.imageUrl ? (
                                            <div className="relative flex flex-col items-center">
                                                <img src={formData.imageUrl} alt="preview" className="h-32 w-32 object-cover rounded-lg border-2 border-amber-400 shadow transition-all duration-200" />
                                                <button
                                                    type="button"
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow focus:outline-none focus:ring-2 focus:ring-red-400"
                                                    onClick={e => { e.stopPropagation(); setFormData(prev => ({ ...prev, imageUrl: '' })); }}
                                                    tabIndex={0}
                                                    aria-label="Xoá ảnh"
                                                    disabled={uploadingImage || isSubmitting}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                {uploadingImage && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                                                        <svg className="w-8 h-8 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 3.13a4 4 0 010 7.75M12 7v6m0 0l-2-2m2 2l2-2" />
                                                </svg>
                                                <p className="text-lg text-gray-300 font-medium mb-1">Kéo thả hoặc nhấp để tải lên</p>
                                                <p className="text-gray-400 text-sm mb-4">Hỗ trợ JPG, PNG hoặc WEBP (tối đa 5MB mỗi ảnh)</p>
                                                <button
                                                    type="button"
                                                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold shadow transition-all duration-200"
                                                    onClick={e => { e.stopPropagation(); handleDropzoneClick(); }}
                                                    disabled={uploadingImage || isSubmitting}
                                                >
                                                    Chọn Ảnh
                                                </button>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={e => { if (e.target.files && e.target.files[0]) handleFileValidationAndUpload(e.target.files[0]); }}
                                                    disabled={uploadingImage || isSubmitting}
                                                    className="hidden"
                                                />
                                                {uploadingImage && (
                                                    <svg className="w-6 h-6 animate-spin text-amber-400 mt-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    {errors.imageUrl && <p className="text-red-400 text-sm mt-1">{errors.imageUrl}</p>}
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
                                        disabled={isSubmitting || !formData.name.trim()}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang tạo...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Tạo danh mục
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