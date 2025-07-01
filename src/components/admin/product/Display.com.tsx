import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ProductService } from '../../../services/product/product.service';
import type { ProductResponse } from '../../../types/product/Product.res.type';
import { useQuery } from '@tanstack/react-query';
import { useCategory } from '@hooks/modules/useCategory';
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';

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

    // Categories for filter dropdown
    const [categories, setCategories] = useState<ICategory[]>([]);

    const {
        getCategorys,
    } = useCategory();

    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await getCategorys.mutateAsync();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setCategories([]);
        }
    }, [getCategorys]);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products using React Query
    const {
        data: productsResponse,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['admin-products', refreshTrigger],
        queryFn: () => ProductService.getProducts({
            categoryId: categoryFilter,
            sortField: 'createdAt',
            ascending: false
        })
    });

    const products: ProductResponse[] = Array.isArray(productsResponse?.data) ? productsResponse.data : [];

    // Filter products based on search and filters
    const filteredProducts = products.filter((product: ProductResponse) => {
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

    const getStatusBadge = (status: number) => {
        const statusConfig = {
            0: { text: 'Nháp', color: 'bg-gray-500' },
            1: { text: 'Chờ duyệt', color: 'bg-yellow-500' },
            2: { text: 'Chờ thanh toán', color: 'bg-orange-500' },
            3: { text: 'Đã thanh toán', color: 'bg-green-500' },
            4: { text: 'Đã duyệt', color: 'bg-blue-500' },
            5: { text: 'Từ chối', color: 'bg-red-500' }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[0];
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
                {config.text}
            </span>
        );
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-lg shadow-lg">
            <div className="max-w-7xl mx-auto">

                {/* -------------------------------  HEADER  ------------------------------ */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold text-white">
                                Quản Lý Sản Phẩm
                            </h1>
                            <span className="text-gray-400">
                                ({filteredProducts.length} sản phẩm)
                            </span>

                            {selectedProductIds.length > 0 && (
                                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                                    {selectedProductIds.length} đã chọn
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => refetch()}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h4m2 0h10a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                            </svg>
                            Làm mới
                        </button>
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
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-700 rounded bg-gray-800"
                                />
                                <span className="text-sm font-medium text-gray-300">
                                    Chọn tất cả ({filteredProducts.length})
                                </span>
                            </label>

                            {selectedProductIds.length > 0 && (
                                <button
                                    onClick={() => { setSelectedProductIds([]); onBulkSelect([]); }}
                                    className="text-sm text-gray-400 hover:text-gray-200"
                                >
                                    Bỏ chọn tất cả
                                </button>
                            )}
                        </div>
                    )}

                    {/* filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Tìm kiếm</label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Tìm theo thương hiệu, model, mô tả..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                />
                            </div>
                        </div>

                        {/* status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Trạng thái</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value={0}>Nháp</option>
                                <option value={1}>Chờ duyệt</option>
                                <option value={2}>Chờ thanh toán</option>
                                <option value={3}>Đã thanh toán</option>
                                <option value={4}>Đã duyệt</option>
                                <option value={5}>Từ chối</option>
                            </select>
                        </div>

                        {/* category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Danh mục</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
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

                {/* ---------------------------  GRID  --------------------------- */}
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
                    ) : (
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
                                            onClick={() => onEdit(product)}
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

                                    {/* image */}
                                    <div className="h-40 bg-gray-700 rounded-lg overflow-hidden mb-4">
                                        {product.imageUrls?.[0] ? (
                                            <img
                                                src={product.imageUrls[0]}
                                                alt={`${product.brand} ${product.model}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M9 14h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* status / verified */}
                                    <div className="flex gap-2 mb-3">
                                        {getStatusBadge(product.status)}
                                        {product.isVerified && (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white bg-green-600">
                                                Đã xác minh
                                            </span>
                                        )}
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

                                    <p className="text-sm text-gray-300 line-clamp-2">
                                        {product.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};
