import React, { useState, useEffect, useCallback } from 'react';
import { useCategory } from "@hooks/modules/useCategory";
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';
import { CreateCom } from './Create.com.tsx';
import { UpdateCom } from './Update.com.tsx';
import { motion } from 'framer-motion';
import { helpers } from "@utils/index.ts";
import SearchCommon from '../../common/SearchCommon.com';
import { DeleteCom } from "./Delete.com.tsx";
// @ts-ignore
import type { GetCategoriesParams } from '../../../types/category/Category.req.type.ts';
// StatsCard component
interface StatsCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    tooltip?: string;
}
const StatsCard = ({ label, value, icon, iconBg, iconColor, tooltip }: StatsCardProps) => (
    <div
        className="flex flex-col justify-between bg-gray-800/50 border border-gray-700 rounded-lg px-5 py-3 min-w-[140px] hover:border-amber-400 transition-all duration-200 cursor-default group items-center"
        title={tooltip || label}
    >
        <span className="text-gray-400 text-sm mb-2 whitespace-nowrap">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{value}</span>
            <span className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
                <span className={iconColor}>{icon}</span>
            </span>
        </div>
    </div>
);


export const DisplayCom = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    // Change default viewMode to 'table'
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [isSearching, setIsSearching] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(1000);
    const [totalCategories, setTotalCategories] = useState(0);

    const {
        getCategorys,
        createCategory,
        updateCategory,
        deleteCategory,
        getCategoriesByName
    } = useCategory();

    const fetchCategories = useCallback(async (params?: GetCategoriesParams) => {
        try {
            const requestParams = {
                pageNumber: currentPage,
                pageSize: pageSize,
                ...params
            };
            const { data } = await getCategorys.mutateAsync(requestParams);
            setCategories(data || []);
            // Note: You may need to get total count from API response if available
            setTotalCategories(data?.length || 0);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    }, [getCategorys, currentPage, pageSize]);

    const handleSearch = async () => {
        if (!searchTerm) {
            fetchCategories();
            return;
        }
        setIsSearching(true);
        try {
            const searchParams: GetCategoriesParams = {
                name: searchTerm,
                pageNumber: 1, // Reset to first page when searching
                pageSize: 1000
            };
            const filtered = await getCategoriesByName.mutateAsync(searchParams);
            setCategories(filtered || []);
            setCurrentPage(1); // Reset current page when searching
        } catch (error) {
            // fallback: do nothing
        } finally {
            setIsSearching(false);
        }
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Handle page size change
    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    useEffect(() => {
        fetchCategories();
    }, [currentPage, pageSize]);

    const handleCreateSuccess = useCallback(() => {
        setIsCreateModalVisible(false);
        fetchCategories();
    }, [fetchCategories]);

    const handleUpdateSuccess = useCallback(() => {
        setIsUpdateModalVisible(false);
        setSelectedCategory(null);
        fetchCategories();
    }, [fetchCategories]);

    const handleDelete = useCallback((category: ICategory) => {
        setSelectedCategory(category);
        setIsDeleteModalVisible(true);
    }, []);

    const handleDeleteSuccess = useCallback(() => {
        setIsDeleteModalVisible(false);
        setSelectedCategory(null);
        fetchCategories();
    }, [fetchCategories]);

    const getParentCategoryName = (parentCategoryId: string | null) => {
        if (!parentCategoryId) return 'Không có';
        const parent = categories.find(c => c.id === parentCategoryId);
        return parent ? parent.name : 'Không rõ';
    };

    // Remove auto search: do not filter as user types
    // Only update categories when handleSearch is called
    // Remove filteredCategories, use categories directly for display

    return (
        <div className="min-h-screen p-6 rounded-lg">
            <div className="max-w-7xl mx-auto">
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
                        <div className="flex items-center gap-2">
                            {/* Nút chuyển đổi Table/Grid */}

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
                    </div>
                </motion.div>

                <div className="flex gap-3 mb-6 items-stretch">
                    <StatsCard
                        label="Tổng danh mục"
                        value={totalCategories}
                        iconBg="bg-amber-500/20"
                        iconColor="text-amber-400"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        }
                        tooltip="Tổng số danh mục trong hệ thống"
                    />
                    <StatsCard
                        label="Kết quả tìm kiếm"
                        value={searchTerm ? categories.length : '—'}
                        iconBg="bg-blue-500/20"
                        iconColor="text-blue-400"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }
                        tooltip="Số danh mục khớp với tìm kiếm"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch">
                        {/* Search */}
                        <div className="flex-1 flex items-center gap-2">
                            <SearchCommon
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                onSearch={handleSearch}
                                loading={isSearching}
                                placeholder="Tìm kiếm danh mục..."
                            />
                            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'table'
                                        ? 'bg-amber-500 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                        }`}
                                    title="Xem dạng bảng"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'grid'
                                        ? 'bg-amber-500 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                        }`}
                                    title="Xem dạng lưới"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {/* Stats */}
                    </div>
                </motion.div>





                {/* Categories Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {categories.length === 0 ? (
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
                    ) : viewMode === 'table' ? (
                        // Table View
                        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800 border-b border-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ảnh</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tên danh mục</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Danh mục cha</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ngày tạo</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {categories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-700/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    {category.imageUrl ? (
                                                        <img
                                                            src={category.imageUrl}
                                                            alt={category.name}
                                                            className="w-12 h-12 object-cover rounded-lg border border-gray-700"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-white font-semibold">{category.name}</td>
                                                <td className="px-4 py-3 text-gray-300">{getParentCategoryName(category.parentCategoryId)}</td>
                                                <td className="px-4 py-3 text-gray-400">{helpers.formatDate(category.createdAt)}</td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                                        Hoạt động
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
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
                                                            onClick={() => handleDelete(category)}
                                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                                            title="Xóa"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        // Grid view giữ nguyên như cũ
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-200 hover:transform hover:scale-105"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        {category.imageUrl ? (
                                            <img
                                                src={category.imageUrl}
                                                alt={category.name}
                                                className="w-12 h-12 object-cover rounded-lg border border-gray-700"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                            </div>
                                        )}
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
                                                onClick={() => handleDelete(category)}
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
                                    <p className="text-gray-300 text-sm">
                                        Cha: {getParentCategoryName(category.parentCategoryId)}
                                    </p>

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

                {/* Pagination Controls */}
                {categories.length > 0 && (
                    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                        {/* Page Size Selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Hiển thị:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-amber-400"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-gray-400 text-sm">mục/trang</span>
                        </div>

                        {/* Pagination Info */}
                        <div className="text-gray-400 text-sm">
                            Trang {currentPage} - Hiển thị {categories.length} mục
                        </div>

                        {/* Pagination Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="px-3 py-1 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Trước
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {[...Array(Math.min(5, Math.ceil(totalCategories / pageSize)))].map((_, index) => {
                                    const pageNum = currentPage - 2 + index;
                                    if (pageNum < 1) return null;

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${pageNum === currentPage
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-gray-700 text-white hover:bg-gray-600'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={categories.length < pageSize}
                                className="px-3 py-1 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateCom
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onSuccess={handleCreateSuccess}
                createCategory={createCategory as any}
                categories={categories}
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
                    categories={categories}
                />
            )}

            {selectedCategory && (
                <DeleteCom
                    visible={isDeleteModalVisible}
                    category={selectedCategory}
                    categoryId={selectedCategory.id}
                    onClose={() => {
                        setIsDeleteModalVisible(false);
                        setSelectedCategory(null);
                    }}
                    onSuccess={handleDeleteSuccess}
                    deleteCategory={deleteCategory as any}
                    parentCategoryName={getParentCategoryName(selectedCategory.parentCategoryId)}
                />
            )}
        </div>
    );
};