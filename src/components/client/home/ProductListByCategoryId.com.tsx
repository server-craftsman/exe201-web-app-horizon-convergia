import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProduct from '@hooks/modules/useProduct';
import { motion } from 'framer-motion';

const ProductListByCategoryId: React.FC = () => {
    // Get dynamic category ID from URL: /thuong-hieu/:categoryId
    const { categoryId } = useParams<{ categoryId: string }>();

    const {
        products,
        isLoadingProducts,
        productsError,
    } = useProduct();

    // Filter products by the desired category ID (case-sensitive match)
    const filteredProducts = useMemo(() => {
        if (!categoryId || !products) return [];
        return (products as any[]).filter(
            (product) => product.categoryId === categoryId || product.category?.id === categoryId
        );
    }, [products, categoryId]);

    if (isLoadingProducts) {
        return <p className="text-center py-10 text-gray-500">Đang tải sản phẩm...</p>;
    }

    if (productsError) {
        return <p className="text-center py-10 text-red-500">Đã xảy ra lỗi khi tải sản phẩm.</p>;
    }

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 relative">
                    <span className="relative z-10">SẢN PHẨM CỦA DANH MỤC</span>
                    <span className="absolute w-24 h-1 bg-amber-400 bottom-0 left-1/2 transform -translate-x-1/2 -mb-2" />
                </h2>

                {filteredProducts.length === 0 ? (
                    <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào cho danh mục này.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product: any, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                            >
                                <Link to={`/san-pham/${product.id}`} className="block">
                                    {product.thumbnailUrl ? (
                                        <img
                                            src={product.thumbnailUrl}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                            No Image
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate" title={product.name}>
                                            {product.name}
                                        </h3>
                                        <p className="text-amber-600 font-bold mt-2">
                                            {product.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductListByCategoryId;
