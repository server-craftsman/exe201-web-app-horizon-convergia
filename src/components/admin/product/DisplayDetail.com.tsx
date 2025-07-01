import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../../../services/product/product.service';
import type { ProductResponse } from '../../../types/product/Product.res.type';
import { motion } from 'framer-motion';

interface DisplayDetailProps {
    productId: string;
    onClose: () => void;
}

export const DisplayDetailComponent: React.FC<DisplayDetailProps> = ({ productId, onClose }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['product-detail', productId],
        queryFn: () => ProductService.getProductById(productId),
        enabled: !!productId
    });

    const product: ProductResponse | undefined = data?.data as ProductResponse | undefined;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <div
                className="absolute inset-0" onClick={onClose}
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 18 }}
                className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-amber-500 to-amber-600">
                    <h2 className="text-xl font-bold text-white">Chi tiết sản phẩm</h2>
                    <button onClick={onClose} className="text-white text-2xl leading-none">&times;</button>
                </div>

                <div className="p-6 space-y-6 text-gray-200">
                    {isLoading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                            Có lỗi xảy ra khi tải chi tiết sản phẩm.
                        </div>
                    )}

                    {product && (
                        <>
                            {/* Images */}
                            {product.imageUrls && product.imageUrls.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {product.imageUrls.map((url, idx) => (
                                        <img key={idx} src={url} alt={`img-${idx}`} className="w-full h-40 object-cover rounded-lg" />
                                    ))}
                                </div>
                            )}

                            {/* Basic info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p><span className="font-semibold">Thương hiệu:</span> {product.brand}</p>
                                    <p><span className="font-semibold">Model:</span> {product.model}</p>
                                    <p><span className="font-semibold">Năm:</span> {product.year}</p>
                                    <p><span className="font-semibold">Giá:</span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                                </div>
                                <div>
                                    <p><span className="font-semibold">Tình trạng:</span> {product.condition}</p>
                                    <p><span className="font-semibold">Số lượng:</span> {product.quantity}</p>
                                    <p><span className="font-semibold">Địa điểm:</span> {product.location}</p>
                                    <p><span className="font-semibold">Danh mục:</span> {product.categoryId}</p>
                                </div>
                            </div>

                            {/* Detailed specs */}
                            {(product.engineCapacity || product.fuelType || product.mileage || product.color) && (
                                <div>
                                    <h3 className="text-lg font-bold mb-2">Thông số kỹ thuật</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {product.engineCapacity && <li>Dung tích xi-lanh: {product.engineCapacity} cc</li>}
                                        {product.fuelType && <li>Nhiên liệu: {product.fuelType}</li>}
                                        {product.mileage && <li>Số km đã đi: {product.mileage}</li>}
                                        {product.color && <li>Màu sắc: {product.color}</li>}
                                        {product.accessoryType && <li>Loại phụ kiện: {product.accessoryType}</li>}
                                        {product.size && <li>Kích thước/Size: {product.size}</li>}
                                        {product.sparePartType && <li>Loại phụ tùng: {product.sparePartType}</li>}
                                        {product.vehicleCompatible && <li>Tương thích xe: {product.vehicleCompatible}</li>}
                                    </ul>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-bold mb-2">Mô tả</h3>
                                <div className="prose max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: product.description }} />
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};
