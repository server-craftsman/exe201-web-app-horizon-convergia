import React, { useEffect, useState } from 'react';
import { useProduct, useCategory } from '../../../hooks';
import type { ProductResponse } from '../../../types/product/Product.res.type';
import AddProduct from './AddProduct.com';
import { PlusOutlined } from '@ant-design/icons';
// @ts-ignore
import { GetCategoriesParams } from '../../../types/category/Category.req.type';

const Products: React.FC = () => {
    const {
        useUnverifiedProductsBySeller,
        filterProductsBySeller,
        getStatusText,
        getStatusColor,
        // sendProductPayment, // Xoá hàm handleSendPayment và mọi chỗ gọi sendProductPayment
        // isSendingPayment
    } = useProduct();
    const { getCategorys } = useCategory();
    const [categories, setCategories] = useState<any[]>([]);
    useEffect(() => {
        const loadCategories = async () => {
            try {
                // Request all categories for the dropdown (no pagination limit)
                const result = await getCategorys.mutateAsync({ pageSize: 1000 });
                if (result?.data) setCategories(result.data);
            } catch { }
        };
        loadCategories();
    }, []);
    const [sellerId, setSellerId] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [filter, setFilter] = useState({
        categoryId: '',
        sortField: 'createdAt',
        ascending: false,
        pageNumber: 1,
        pageSize: 10,
    });

    // Get sellerId from localStorage
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            return;
        }

        if (userId) {
            setSellerId(userId);
            setError('');
        } else {
            setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        }
    }, []);

    // Use the new hook to get unverified/unpaid products for this seller
    const { data: unverifiedProducts, isLoading, error: unverifiedProductsError, refetch } = useUnverifiedProductsBySeller(sellerId, filter);

    // Filter unverified products by seller using the utility function (if needed)
    const sellerUnverifiedProducts: ProductResponse[] = unverifiedProducts ? filterProductsBySeller(unverifiedProducts, sellerId) : [];

    // Xoá hàm handleSendPayment và mọi chỗ gọi sendProductPayment
    // Callback sau khi thêm sản phẩm thành công
    const handleAddProductSuccess = () => {
        setShowAddProduct(false);
        refetch();
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="p-6 text-center">
                <div className="text-white flex items-center justify-center space-x-2">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải sản phẩm chưa thanh toán...</span>
                </div>
            </div>
        );
    }

    // Show error state for missing sellerId
    if (error) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-400 mb-4">{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Tải lại trang
                </button>
            </div>
        );
    }

    // Show error state
    if (unverifiedProductsError) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-400 mb-4">Có lỗi xảy ra khi tải sản phẩm chưa thanh toán</div>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Filter UI */}
            <form className="mb-6 bg-gray-800/60 p-4 rounded-lg border border-gray-700" onSubmit={e => { e.preventDefault(); refetch(); }}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-xs text-gray-300 mb-1">Danh mục</label>
                        <select
                            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                            value={filter.categoryId}
                            onChange={e => setFilter(f => ({ ...f, categoryId: e.target.value }))}
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-300 mb-1">Sắp xếp theo</label>
                        <select
                            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                            value={filter.sortField}
                            onChange={e => setFilter(f => ({ ...f, sortField: e.target.value }))}
                        >
                            <option value="createdAt">Ngày tạo</option>
                            <option value="price">Giá</option>
                            <option value="year">Năm sản xuất</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-300 mb-1">Thứ tự</label>
                        <select
                            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                            value={filter.ascending ? 'asc' : 'desc'}
                            onChange={e => setFilter(f => ({ ...f, ascending: e.target.value === 'asc' }))}
                        >
                            <option value="desc">Giảm dần</option>
                            <option value="asc">Tăng dần</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
                        >
                            <span>🔍</span>
                            <span>Lọc</span>
                        </button>
                    </div>
                </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-xs text-gray-300 mb-1">Trang</label>
                        <input
                            type="number"
                            min={1}
                            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                            value={filter.pageNumber}
                            onChange={e => setFilter(f => ({ ...f, pageNumber: Number(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-300 mb-1">Số sản phẩm/trang</label>
                        <input
                            type="number"
                            min={1}
                            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                            value={filter.pageSize}
                            onChange={e => setFilter(f => ({ ...f, pageSize: Number(e.target.value) }))}
                        />
                    </div>
                </div> */}
            </form>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Sản Phẩm Chưa Thanh Toán</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Quản lý các sản phẩm chưa xác thực và chưa thanh toán
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddProduct(true)}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
                    >
                        <PlusOutlined />
                        <span>Thêm sản phẩm mới</span>
                    </button>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                        <span>🔄</span>
                        <span>Làm mới</span>
                    </button>
                </div>
            </div>

            {/* Hiển thị form thêm sản phẩm (có thể là modal hoặc section) */}
            {showAddProduct && (
                <div className="mb-8 bg-gray-900/80 border border-amber-600 rounded-lg p-6 relative">
                    <button
                        onClick={() => setShowAddProduct(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-2xl font-bold"
                        aria-label="Đóng"
                    >
                        ×
                    </button>
                    <AddProduct onSuccess={handleAddProductSuccess} />
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-gray-400 text-sm">Tổng sản phẩm chưa thanh toán</div>
                    <div className="text-2xl font-bold text-white">{unverifiedProducts?.length || 0}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-yellow-600">
                    <div className="text-gray-400 text-sm">Sản phẩm của tôi</div>
                    <div className="text-2xl font-bold text-yellow-400">{sellerUnverifiedProducts.length}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-blue-600">
                    <div className="text-gray-400 text-sm">Cần thanh toán</div>
                    <div className="text-2xl font-bold text-blue-400">{sellerUnverifiedProducts.length}</div>
                </div>
            </div>

            {/* Seller's Unverified Products */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <span>⏳</span>
                    <span>Sản phẩm của tôi cần thanh toán ({sellerUnverifiedProducts.length})</span>
                </h3>

                {sellerUnverifiedProducts.length === 0 ? (
                    <div className="text-center text-gray-400 py-12 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="text-6xl mb-4">🎉</div>
                        <p className="text-lg mb-2">Tuyệt vời! Không có sản phẩm nào cần thanh toán.</p>
                        <p className="text-sm">Tất cả sản phẩm của bạn đã được xác thực và thanh toán.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sellerUnverifiedProducts.map((product: ProductResponse) => (
                            <div key={product.id} className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 transform hover:-translate-y-1">
                                {/* Product Images */}
                                <div className="relative">
                                    <ProductImageGallery imageUrls={product.imageUrls || []} brand={product.brand} model={product.model} />
                                    {/* Status badge */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${getStatusColor(product.status)} bg-black/30`}>
                                            {getStatusText(product.status)}
                                        </span>
                                    </div>
                                </div>

                                {/* Product Content */}
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                                            {product.brand} {product.model}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>Năm: {product.year}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Tình trạng: {getConditionText(product.condition ?? '')}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                <span>Số lượng: {product.quantity}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-4">
                                        <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }}></p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-emerald-400">
                                                {product.price?.toLocaleString('vi-VN')}
                                            </span>
                                            <span className="text-lg text-emerald-300">₫</span>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="bg-gray-700/50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-xs font-medium text-gray-300">Địa điểm</span>
                                            </div>
                                            <p className="text-sm text-white font-medium truncate">{product.location}</p>
                                        </div>
                                        
                                        <div className="bg-gray-700/50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs font-medium text-gray-300">Tạo lúc</span>
                                            </div>
                                            <p className="text-sm text-white font-medium">
                                                {new Date(product.createdAt).toLocaleString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-gray-700/50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs font-medium text-gray-300">Xác thực</span>
                                            </div>
                                            <span className={`text-sm font-semibold ${product.isVerified ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {product.isVerified ? '✓ Đã xác thực' : '✗ Chưa xác thực'}
                                            </span>
                                        </div>
                                        
                                        <div className="bg-gray-700/50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                                <span className="text-xs font-medium text-gray-300">Trạng thái</span>
                                            </div>
                                            <span className={`text-sm font-semibold ${getStatusColor(product.status)}`}>
                                                {getStatusText(product.status)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group">
                                                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                <span>Xem chi tiết</span>
                                            </button>
                                            <button className="px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl group">
                                                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        <button className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group">
                                            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Xóa sản phẩm</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <button
                    disabled={filter.pageNumber === 1}
                    onClick={() => setFilter(f => ({ ...f, pageNumber: 1 }))}
                    className="px-2 py-1 mx-1 rounded bg-gray-700 text-white disabled:opacity-50"
                >«</button>
                <button
                    disabled={filter.pageNumber === 1}
                    onClick={() => setFilter(f => ({ ...f, pageNumber: f.pageNumber - 1 }))}
                    className="px-2 py-1 mx-1 rounded bg-gray-700 text-white disabled:opacity-50"
                >‹</button>
                <span className="px-3 py-1 bg-gray-800 text-white rounded">
                    Trang {filter.pageNumber}
                </span>
                <button
                    disabled={sellerUnverifiedProducts.length < filter.pageSize}
                    onClick={() => setFilter(f => ({ ...f, pageNumber: f.pageNumber + 1 }))}
                    className="px-2 py-1 mx-1 rounded bg-gray-700 text-white disabled:opacity-50"
                >›</button>
            </div>
        </div>
    );
};

const conditionMap: { [key: string]: string } = {
    'NEW': 'Mới',
    'LIKE_NEW': 'Như mới',
    'GOOD': 'Tốt',
    'FAIR': 'Khá',
    'POOR': 'Cũ'
};
const getConditionText = (condition: string) => conditionMap[condition] || condition;

// Helper component for Image Gallery within each card
const ProductImageGallery = ({ imageUrls, brand, model }: { imageUrls: string[], brand: string, model: string }) => {
    const [mainImage, setMainImage] = useState(imageUrls[0]);

    useEffect(() => {
        // Reset main image if product changes
        setMainImage(imageUrls[0]);
    }, [imageUrls]);

    if (!imageUrls || imageUrls.length === 0) {
        return (
            <div className="h-64 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Chưa có ảnh</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-64 flex flex-col">
            {/* Main Image */}
            <div className="flex-grow h-4/5 relative overflow-hidden">
                <img
                    src={mainImage}
                    alt={`${brand} ${model}`}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                    onClick={() => window.open(mainImage, '_blank')}
                />
            </div>
            {/* Thumbnails */}
            {imageUrls.length > 1 && (
                <div className="flex-shrink-0 h-1/5 bg-gray-900/50 p-1 flex items-center justify-center gap-1">
                    {imageUrls.map((url, idx) => (
                        <div
                            key={idx}
                            className={`h-full aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${mainImage === url ? 'border-amber-500' : 'border-transparent hover:border-gray-500'}`}
                            onClick={() => setMainImage(url)}
                        >
                            <img
                                src={url}
                                alt={`thumbnail ${idx + 1}`}
                                className={`w-full h-full object-cover transition-opacity duration-200 ${mainImage === url ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;