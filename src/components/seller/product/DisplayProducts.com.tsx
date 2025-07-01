import React, { useEffect, useState } from 'react';
import { useProduct } from '../../../hooks';
import type { ProductResponse } from '../../../types/product/Product.res.type';
import { ROUTER_URL } from '@consts/router.path.const';

const Products: React.FC = () => {
    const {
        unverifiedProducts,
        isLoadingUnverifiedProducts,
        unverifiedProductsError,
        refetchUnverifiedProducts,
        sendProductPayment,
        isSendingPayment,
        getProductsBySeller,
        getStatusText,
        getStatusColor
    } = useProduct();
    const [sellerId, setSellerId] = useState<string>('');
    const [error, setError] = useState<string>('');

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

    // Force refetch when component mounts or seller ID changes
    useEffect(() => {
        if (sellerId) {
            refetchUnverifiedProducts();
        }
    }, [sellerId, refetchUnverifiedProducts]);

    // Filter unverified products by seller using the utility function
    const sellerUnverifiedProducts: ProductResponse[] = sellerId && unverifiedProducts ? getProductsBySeller(sellerId) : [];

    // Handle send payment
    const handleSendPayment = (productId: string) => {
        if (productId) {
            const returnUrl = window.location.origin + ROUTER_URL.SELLER.PRODUCTS;
            sendProductPayment({ productId, returnUrl });
        }
    };

    // Show loading state
    if (isLoadingUnverifiedProducts) {
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
                    onClick={() => refetchUnverifiedProducts()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Sản Phẩm Chưa Thanh Toán</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Quản lý các sản phẩm chưa xác thực và chưa thanh toán
                    </p>
                </div>
                <button
                    onClick={() => refetchUnverifiedProducts()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                    <span>🔄</span>
                    <span>Làm mới</span>
                </button>
            </div>

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
                                {/* Product Image */}
                                <div className="relative mb-3">
                                    {product.imageUrls && product.imageUrls.length > 0 ? (
                                        <img
                                            src={product.imageUrls[0]}
                                            alt={`${product.brand} ${product.model}`}
                                            className="w-full h-40 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gray-700 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-400 text-4xl">📸</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-yellow-600 text-yellow-100 text-xs px-2 py-1 rounded">
                                        {getStatusText(product.status)}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        {product.brand} {product.model} ({product.year})
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
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
                                        <button
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
                                        </button>

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
        </div>
    );
};

export default Products;