import React from 'react';
import { useProduct } from '../../../hooks';

const Products: React.FC = () => {
    const { products, isLoadingProducts, productsError, refetchProducts } = useProduct();

    if (isLoadingProducts) {
        return (
            <div className="p-6 text-center">
                <div className="text-white">Đang tải sản phẩm...</div>
            </div>
        );
    }

    if (productsError) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-400 mb-4">Có lỗi xảy ra khi tải sản phẩm</div>
                <button
                    onClick={() => refetchProducts()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Quản Lý Sản Phẩm</h2>
                <button
                    onClick={() => refetchProducts()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Làm mới
                </button>
            </div>

            {!products || products.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                    <p>Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: any) => (
                        <div key={product.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                            <p className="text-gray-400 mb-3">{product.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-green-400 font-bold">
                                    {product.price?.toLocaleString('vi-VN')} ₫
                                </span>
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                        Sửa
                                    </button>
                                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products; 