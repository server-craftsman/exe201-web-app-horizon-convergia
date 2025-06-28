import { useState, useEffect, useCallback } from 'react';
import { useCategory } from "@hooks/modules/useCategory";
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';
import { CreateCom } from './Create.com.tsx';
import { UpdateCom } from './Update.com.tsx';
import { motion } from 'framer-motion';
import { helpers } from "@utils/index.ts";

export const DisplayCom = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const {
        getCategorys,
        createCategory,
        updateCategory,
        deleteCategory
    } = useCategory();

    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await getCategorys.mutateAsync();
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    }, [getCategorys]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateSuccess = useCallback(() => {
        setIsCreateModalVisible(false);
        fetchCategories();
    }, []);

    const handleUpdateSuccess = useCallback(() => {
        setIsUpdateModalVisible(false);
        setSelectedCategory(null);
        fetchCategories();
    }, []);

    const handleDelete = useCallback(async (id: string, name: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) {
            try {
                await deleteCategory.mutateAsync(id);
                fetchCategories();
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    }, [deleteCategory, fetchCategories]);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-lg shadow-lg">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Quản Lý Danh Mục
                            </h1>
                            <p className="text-gray-400">
                                Quản lý các danh mục sản phẩm của hệ thống
                            </p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalVisible(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tạo Danh Mục
                        </button>
                    </div>
                </motion.div>

                {/* Search and Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm danh mục..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                />
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Tổng danh mục</p>
                                    <p className="text-2xl font-bold text-white">{categories.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Kết quả tìm kiếm</p>
                                    <p className="text-2xl font-bold text-white">{filteredCategories.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Categories Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {searchTerm ? 'Không tìm thấy danh mục' : 'Chưa có danh mục nào'}
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Tạo danh mục đầu tiên để bắt đầu'}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => setIsCreateModalVisible(true)}
                                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
                                >
                                    Tạo Danh Mục Đầu Tiên
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCategories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-200 hover:transform hover:scale-105"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setIsUpdateModalVisible(true);
                                                }}
                                                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                                                title="Chỉnh sửa"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id, category.name)}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                                title="Xóa"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-white mb-2 truncate" title={category.name}>
                                        {category.name}
                                    </h3>

                                    <p className="text-gray-400 text-sm mb-4">
                                        Ngày tạo: {helpers.formatDate(category.createdAt)}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                            Hoạt động
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            ID: {category.id.slice(0, 8)}...
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Modals */}
            <CreateCom
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onSuccess={handleCreateSuccess}
                createCategory={createCategory as any}
            />

            {selectedCategory && (
                <UpdateCom
                    open={isUpdateModalVisible}
                    category={selectedCategory}
                    recordId={selectedCategory.id}
                    onCancel={() => {
                        setIsUpdateModalVisible(false);
                        setSelectedCategory(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                    updateCategory={updateCategory as any}
                />
            )}
        </div>
    );
};