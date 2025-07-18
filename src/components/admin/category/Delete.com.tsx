import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';

interface DeleteComProps {
    visible: boolean;
    category: ICategory | null;
    categoryId: string;
    onClose: () => void;
    onSuccess: () => void;
    deleteCategory: any;
    parentCategoryName: string;
}

export const DeleteCom = ({ visible, category, categoryId, onClose, onSuccess, deleteCategory, parentCategoryName }: DeleteComProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string>('');

    const handleDelete = useCallback(async () => {
        setIsDeleting(true);
        setError('');
        try {
            await deleteCategory.mutateAsync(categoryId);
            onSuccess();
        } catch (error: any) {
            if (error?.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Có lỗi xảy ra khi xóa danh mục');
            }
        } finally {
            setIsDeleting(false);
        }
    }, [deleteCategory, categoryId, onSuccess]);

    const handleCancel = useCallback(() => {
        if (!isDeleting) {
            setError('');
            onClose();
        }
    }, [isDeleting, onClose]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleCancel();
        } else if (e.key === 'Enter' && !isDeleting) {
            handleDelete();
        }
    }, [handleCancel, handleDelete, isDeleting]);

    return (
        <AnimatePresence>
            {visible && (
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
                            <div className="relative bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">
                                                Xóa Danh Mục
                                            </h3>
                                            <p className="text-red-100 text-sm">
                                                Hành động này không thể hoàn tác
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCancel}
                                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                                        disabled={isDeleting}
                                    >
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-red-400 text-sm">{error}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Category Info */}
                                {category && (
                                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium">{category.name}</h4>
                                                <p className="text-gray-400 text-sm">ID: {category.id.slice(0, 8)}...</p>
                                                <p className="text-gray-400 text-sm">
                                                    Danh mục cha: <span className="text-gray-300">{parentCategoryName}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Warning Message */}
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <div>
                                            <h5 className="text-amber-400 font-medium mb-1">Cảnh báo</h5>
                                            <p className="text-amber-300 text-sm">
                                                Bạn có chắc chắn muốn xóa danh mục này? Tất cả sản phẩm thuộc danh mục này có thể bị ảnh hưởng.
                                                Hành động này không thể hoàn tác.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirmation */}
                                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                                    <p className="text-gray-300 text-center">
                                        Nhập <span className="font-mono bg-gray-700 px-2 py-1 rounded text-red-400">{category?.name}</span> để xác nhận
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang xóa...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Xóa danh mục
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};