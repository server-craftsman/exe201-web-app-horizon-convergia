import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { ProductResponse } from '../../../types/product/Product.res.type';
import { ProductStatus } from '../../../app/enums/productStatus.enum';
import { useCategory } from '@hooks/modules/useCategory';
import { useProduct } from '@hooks/modules/useProduct';
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';
import SearchCommon from '../../common/SearchCommon.com';
import { DisplayDetailComponent } from "./DisplayDetail.com";

interface DisplayProductsAdminProps {
    onEdit: (product: ProductResponse) => void;
    onDelete: (product: ProductResponse) => void;
    onBulkSelect?: (products: ProductResponse[]) => void;
    refreshTrigger?: number;
}

export const DisplayProductsAdminComponent: React.FC<DisplayProductsAdminProps> = ({
    onEdit,
    onDelete,
    onBulkSelect,
    refreshTrigger
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<number | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [selectedProductIdForDetail, setSelectedProductIdForDetail] = useState<string | null>(null);

    // Categories for filter dropdown
    const [categories, setCategories] = useState<ICategory[]>([]);

    // Add local state for filter inputs
    const [pendingSearchTerm, setPendingSearchTerm] = useState('');
    const [pendingStatusFilter, setPendingStatusFilter] = useState<number | 'all'>('all');
    const [pendingCategoryFilter, setPendingCategoryFilter] = useState<string | 'all'>('all');

    const {
        getCategorys,
    } = useCategory();

    const { useProducts } = useProduct();

    // Handle edit button click - use existing product data
    const handleEditClick = (product: ProductResponse) => {
        console.log('Edit button clicked for product:', product);
        console.log('Product ID:', product.id);
        console.log('Product brand:', product.brand);
        console.log('Product model:', product.model);
        onEdit(product);
    };

    const fetchCategories = useCallback(async () => {
        try {
            // Request all categories for the dropdown (no pagination limit)
            const { data } = await getCategorys.mutateAsync({ pageNumber: 1, pageSize: 1000 });
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setCategories([]);
        }
    }, [getCategorys]);

    // When user clicks 'Tra Cứu', update the actual filter states
    const handleApplyFilters = () => {
        setSearchTerm(pendingSearchTerm);
        setStatusFilter(pendingStatusFilter);
        setCategoryFilter(pendingCategoryFilter);
        setPageNumber(1); // Optionally reset to first page
    };

    // Sync pending values with actual filter state on mount/refresh
    useEffect(() => {
        setPendingSearchTerm(searchTerm);
        setPendingStatusFilter(statusFilter);
        setPendingCategoryFilter(categoryFilter);
    }, [searchTerm, statusFilter, categoryFilter]);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products using the custom hook with location support
    const {
        data: products,
        isLoading,
        error,
        refetch
    } = useProducts({
        categoryId: categoryFilter === 'all' ? '' : categoryFilter,
        location: searchTerm ? searchTerm : '', // Use searchTerm for location filtering as well
        sortField: 'createdAt',
        ascending: false,
        pageNumber,
        pageSize
    });

    // Refetch when refreshTrigger changes
    useEffect(() => {
        if (refreshTrigger) {
            refetch();
        }
    }, [refreshTrigger, refetch]);

    const productsList: ProductResponse[] = products || [];

    // Filter products based on search and filters
    const filteredProducts = productsList.filter((product: ProductResponse) => {
        const matchesSearch =
            product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Bulk selection handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = filteredProducts.map(p => p.id);
            setSelectedProductIds(allIds);
            onBulkSelect?.(filteredProducts);
        } else {
            setSelectedProductIds([]);
            onBulkSelect?.([]);
        }
    };

    const handleSelectProduct = (productId: string, checked: boolean) => {
        let newSelectedIds: string[];
        if (checked) {
            newSelectedIds = [...selectedProductIds, productId];
        } else {
            newSelectedIds = selectedProductIds.filter(id => id !== productId);
        }

        setSelectedProductIds(newSelectedIds);
        const selectedProducts = filteredProducts.filter(p => newSelectedIds.includes(p.id));
        onBulkSelect?.(selectedProducts);
    };

    const getStatusText = (status: ProductStatus) => {
        switch (status) {
            case ProductStatus.Active: return 'Đang hoạt động';
            case ProductStatus.OutOfStock: return 'Hết hàng';
            case ProductStatus.Suspended: return 'Tạm ngưng';
            default: return 'Không xác định';
        }
    };

    const getCategoryName = (categoryId: string) => {
        const cat = categories.find((c) => c.id.toString() === categoryId);
        return cat ? cat.name : 'Khác';
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>Có lỗi xảy ra khi tải danh sách sản phẩm: {error.message}</p>
                <button
                    onClick={() => refetch()}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    const isAllSelected = filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length;
    const isIndeterminate = selectedProductIds.length > 0 && selectedProductIds.length < filteredProducts.length;

    // Helper to wrap html with enforced white color
    const renderHtmlWhite = (html: string) => (
        <span
            style={{ color: '#fff' }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );

    return (
        <div className="min-h-screen p-2 rounded-lg">
            <div className="max-w-7xl mx-auto">

                {/* -------------------------------  HEADER  ------------------------------ */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* <h1 className="text-3xl font-bold text-white">
                                Quản Lý Sản Phẩm
                            </h1> */}

                        </div>

                        {/* View Mode Toggle */}

                    </div>
                </motion.div>

                {/* --------------------  BULK-SELECT & FILTERS  -------------------- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 space-y-6"
                >
                    {/* bulk-select */}
                    {onBulkSelect && (
                        <div className="flex flex-wrap items-center gap-3 md:gap-5 bg-gray-800/60 rounded-xl px-4 py-2 shadow border border-gray-700">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                                    onChange={e => handleSelectAll(e.target.checked)}
                                    className="h-5 w-5 accent-amber-500 border-gray-600 rounded focus:ring-2 focus:ring-amber-400 transition"
                                />
                                <span className="text-base font-semibold text-gray-100">
                                    Chọn tất cả
                                </span>
                                <span className="text-xs text-gray-400 font-normal">
                                    ({filteredProducts.length} sản phẩm)
                                </span>
                            </label>
                            {selectedProductIds.length > 0 && (
                                <span className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">
                                        {selectedProductIds.length} đã chọn
                                    </span>
                                    <button
                                        onClick={() => { setSelectedProductIds([]); onBulkSelect?.([]); }}
                                        className="text-xs text-gray-400 hover:text-amber-400 transition underline underline-offset-2"
                                    >
                                        Bỏ chọn tất cả
                                    </button>
                                </span>
                            )}

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
                    )}

                    {/* filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 md:gap-6 mb-6">
                        {/* search */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Tìm kiếm</label>
                            <SearchCommon
                                value={pendingSearchTerm}
                                onChange={e => setPendingSearchTerm(e.target.value)}
                                onSearch={handleApplyFilters}
                                placeholder="Tìm theo thương hiệu, model, mô tả..."
                            />
                        </div>

                        {/* status */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Trạng thái</label>
                            <select
                                value={pendingStatusFilter}
                                onChange={e => setPendingStatusFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value={ProductStatus.Active}>Đang hoạt động</option>
                                <option value={ProductStatus.OutOfStock}>Hết hàng</option>
                                <option value={ProductStatus.Suspended}>Tạm ngưng</option>
                            </select>
                        </div>

                        {/* category */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Danh mục</label>
                            <select
                                value={pendingCategoryFilter}
                                onChange={e => setPendingCategoryFilter(e.target.value)}
                                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            >
                                <option value="all">Tất cả danh mục</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id.toString()}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* ---------------------------  CONTENT VIEW  --------------------------- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {filteredProducts.length === 0 ? (
                        /* empty state */
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Không có sản phẩm</h3>
                            <p className="text-gray-400">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                        </div>
                    ) : viewMode === 'table' ? (
                        /* Table View */
                        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50">
                                        <tr>
                                            {onBulkSelect && (
                                                <th className="px-4 py-3 text-left">
                                                    <input
                                                        type="checkbox"
                                                        checked={isAllSelected}
                                                        ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-700 rounded bg-gray-800"
                                                    />
                                                </th>
                                            )}
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Hình ảnh
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Thông tin
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Giá
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Trạng thái
                                            </th>
                                            {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Danh mục
                                            </th> */}
                                            {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Ngày tạo
                                            </th> */}
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {filteredProducts.map((product, index) => (
                                            <motion.tr
                                                key={product.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-gray-700/30 transition-colors"
                                            >
                                                {onBulkSelect && (
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedProductIds.includes(product.id)}
                                                            onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                                                            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-700 rounded bg-gray-800"
                                                        />
                                                    </td>
                                                )}
                                                <td className="px-4 py-3">
                                                    {product.imageUrls && product.imageUrls.length > 0 ? (
                                                        <img
                                                            src={product.imageUrls[0]}
                                                            alt="Ảnh đại diện"
                                                            className="w-14 h-14 object-cover rounded border-2 border-amber-500 shadow cursor-pointer hover:scale-110 transition-transform"
                                                            title="Xem ảnh lớn"
                                                            onClick={() => window.open(product.imageUrls[0], '_blank')}
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M9 14h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-white mb-1 hover:text-amber-400 cursor-pointer" onClick={() => setSelectedProductIdForDetail(product.id)}>
                                                            {product.brand} {product.model}
                                                        </h4>
                                                        <p className="text-xs text-gray-400 mb-1">
                                                            Năm: {product.year} | Tình trạng: {product.condition}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            Số lượng: {product.quantity} | Địa điểm: {product.location}
                                                        </p>
                                                        <div
                                                            className="text-xs text-gray-300 mt-1 line-clamp-2 max-w-xs"
                                                            style={{ color: '#fff' }}
                                                        >
                                                            {renderHtmlWhite(product.description)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-lg font-bold text-amber-500">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-row items-center gap-1">
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-gray-600 whitespace-nowrap">
                                                            {getStatusText(product.status)}
                                                        </span>
                                                        {/* {product.isVerified && (
                                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white bg-green-600 whitespace-nowrap">
                                                                Đã xác minh
                                                            </span>
                                                        )} */}
                                                    </div>
                                                </td>
                                                {/* <td className="px-4 py-3">
                                                    <span className="text-sm text-gray-300">
                                                        {getCategoryName(product.categoryId)}
                                                    </span>
                                                </td> */}
                                                {/* <td className="px-4 py-3">
                                                    <span className="text-sm text-gray-400">
                                                        {formatDate(product.createdAt)}
                                                    </span>
                                                </td> */}
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setSelectedProductIdForDetail(product.id)}
                                                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                                                            title="Xem chi tiết"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditClick(product)}
                                                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M12 7.5l6.364 6.364m-2.828-8.485a2 2 0 112.828 2.828L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => onDelete(product)}
                                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                            title="Xoá"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        /* Grid View (existing code) */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-200 hover:scale-105 relative"
                                >
                                    {/* checkbox */}
                                    {onBulkSelect && (
                                        <div className="absolute top-3 left-3 z-10">
                                            <input
                                                type="checkbox"
                                                checked={selectedProductIds.includes(product.id)}
                                                onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-700 rounded bg-gray-800"
                                            />
                                        </div>
                                    )}

                                    {/* edit / delete */}
                                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                                        <button
                                            onClick={() => setSelectedProductIdForDetail(product.id)}
                                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                                            title="Xem chi tiết"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                            title="Chỉnh sửa"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M12 7.5l6.364 6.364m-2.828-8.485a2 2 0 112.828 2.828L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(product)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Xoá"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* images */}
                                    {product.imageUrls && product.imageUrls.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {product.imageUrls.map((url, idx) => (
                                                <img
                                                    key={idx}
                                                    src={url}
                                                    alt={`img-${idx}`}
                                                    className="w-full h-32 object-cover rounded-lg border border-gray-700 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                                                    onClick={() => window.open(url, '_blank')}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-40 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                                            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M9 14h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* status / verified */}
                                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-gray-600">
                                            {getStatusText(product.status)}
                                        </span>
                                        {/* {product.isVerified && (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white bg-green-600 ml-1">
                                                Đã xác minh
                                            </span>
                                        )} */}
                                    </div>

                                    {/* info */}
                                    <h3 className="text-lg font-semibold text-white mb-1 truncate" title={`${product.brand} ${product.model}`}>
                                        {product.brand} {product.model}
                                    </h3>
                                    <p className="text-2xl font-bold text-amber-500 mb-3">
                                        {formatPrice(product.price)}
                                    </p>

                                    <div className="space-y-1 text-sm text-gray-400 mb-3">
                                        <p><span className="font-medium">Danh mục:</span> {getCategoryName(product.categoryId)}</p>
                                        <p><span className="font-medium">Năm:</span> {product.year}</p>
                                        <p><span className="font-medium">Tình trạng:</span> {product.condition}</p>
                                        <p><span className="font-medium">Số lượng:</span> {product.quantity}</p>
                                        <p><span className="font-medium">Địa điểm:</span> {product.location}</p>
                                        <p><span className="font-medium">Ngày tạo:</span> {formatDate(product.createdAt)}</p>
                                    </div>

                                    <div
                                        className="text-sm text-gray-300 line-clamp-2"
                                        style={{ color: '#fff' }}
                                    >
                                        {renderHtmlWhite(product.description)}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                <DisplayDetailComponent
                    productId={selectedProductIdForDetail}
                    onClose={() => setSelectedProductIdForDetail(null)}
                    categories={categories}
                />

                {/* Pagination controls (add after the grid) */}
                <div className="flex justify-center mt-8 gap-2">
                    <button
                        onClick={() => setPageNumber(1)}
                        disabled={pageNumber === 1}
                        className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                    >«</button>
                    <button
                        onClick={() => setPageNumber(pageNumber - 1)}
                        disabled={pageNumber === 1}
                        className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                    >‹</button>
                    <span className="px-4 py-1 bg-gray-800 text-white rounded">Trang {pageNumber}</span>
                    <button
                        onClick={() => setPageNumber(pageNumber + 1)}
                        disabled={productsList.length < pageSize}
                        className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                    >›</button>
                </div>

                {/* Optional: page size selector */}
                <div className="flex justify-center mt-2">
                    <label className="text-gray-400 mr-2">Số sản phẩm/trang:</label>
                    <select
                        value={pageSize}
                        onChange={e => { setPageSize(Number(e.target.value)); setPageNumber(1); }}
                        className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
                    >
                        {[5, 10, 20, 50].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
