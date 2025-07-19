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
                            <div key={product.id} className="bg-gray-800 rounded-lg p-4 border border-yellow-600 hover:border-yellow-500 transition-colors">
                                {/* Product Images */}
                                {product.imageUrls && product.imageUrls.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {product.imageUrls.map((url, idx) => (
                                            <img
                                                key={idx}
                                                src={url}
                                                alt={`img-${idx}`}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-700 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                                                onClick={() => window.open(url, '_blank')}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-full h-24 bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                                        <span className="text-gray-400 text-4xl">📸</span>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        {product.brand} {product.model} ({product.year})
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: product.description }}></p>
                                </div>

                                <div className="space-y-1 text-sm mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">📍 Địa điểm:</span>
                                        <span className="text-white">{product.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">🔧 Tình trạng:</span>
                                        <span className="text-white">{product.condition}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">📦 Số lượng:</span>
                                        <span className="text-white">{product.quantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">📊 Trạng thái:</span>
                                        <span className={getStatusColor(product.status)}>
                                            {getStatusText(product.status)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">✅ Xác thực:</span>
                                        <span className={`${product.isVerified ? 'text-green-400' : 'text-red-400'}`}>
                                            {product.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">📅 Tạo lúc:</span>
                                        <span className="text-white">
                                            {new Date(product.createdAt).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-700 pt-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-green-400 font-bold text-xl">
                                            {product.price?.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                        {/* Xoá nút gửi thanh toán và logic liên quan */}
                                        {/* <button
                                            onClick={() => handleSendPayment(product.id)}
                                            disabled={isSendingPayment}
                                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                        >
                                            {isSendingPayment ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Đang gửi link...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>💳</span>
                                                    <span>Gửi Link Thanh Toán</span>
                                                </>
                                            )}
                                        </button> */}

                                        {/* <div className="flex space-x-2">
                                            <button className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1">
                                                <span>✏️</span>
                                                <span>Sửa</span>
                                            </button>
                                            <button className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1">
                                                <span>🗑️</span>
                                                <span>Xóa</span>
                                            </button>
                                        </div> */}
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

export default Products;