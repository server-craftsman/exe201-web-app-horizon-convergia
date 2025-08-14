import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../../../services/product/product.service';
import type { ProductResponse } from '../../../types/product/Product.res.type';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';

interface DisplayDetailProps {
    productId: string | null;
    onClose: () => void;
    categories: ICategory[];
}

export const DisplayDetailComponent: React.FC<DisplayDetailProps> = ({ productId, onClose, categories }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['product-detail', productId],
        queryFn: () => ProductService.getProductById(productId!),
        enabled: !!productId
    });

    const product: ProductResponse | undefined = data?.data as ProductResponse | undefined;

    const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const getCategoryName = (categoryId: string) => {
        const cat = categories.find((c) => c.id.toString() === categoryId);
        return cat ? cat.name : 'Không rõ';
    };

    const getStatusText = (status: number) => {
        // Assuming ProductStatus enum exists, mapping number to text
        if (status === 0) return { text: 'Khả dụng', className: 'bg-green-500/10 text-green-400' };
        if (status === 1) return { text: 'Không khả dụng', className: 'bg-red-500/10 text-red-400' };
        if (status === 2) return { text: 'Chờ thanh toán', className: 'bg-yellow-500/10 text-yellow-400' };
        if (status === 3) return { text: 'Đã thanh toán', className: 'bg-blue-500/10 text-blue-400' };
        return { text: 'Không xác định', className: 'bg-gray-500/10 text-gray-400' };
    };

    const getConditionText = (condition: string) => {
        const conditionMap: { [key: string]: string } = {
            'NEW': 'Mới',
            'LIKE_NEW': 'Như mới', 
            'GOOD': 'Tốt',
            'FAIR': 'Khá',
            'POOR': 'Cũ'
        };
        return conditionMap[condition] || condition;
    };


    return (
        <AnimatePresence>
            {productId && (
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative bg-gray-700 border-l border-gray-700 w-full max-w-2xl h-full shadow-2xl flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 250 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-white">Chi tiết sản phẩm</h2>
                            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 text-gray-200 overflow-y-auto flex-grow">
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
                                                <img key={idx} src={url} alt={`img-${idx}`} className="w-full h-40 object-cover rounded-lg border border-gray-700" />
                                            ))}
                                        </div>
                                    )}

                                    {/* Basic info */}
                                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                        <h3 className="text-lg font-semibold text-amber-400 mb-3">Thông tin cơ bản</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <p><span className="font-semibold text-gray-400">Thương hiệu:</span> {product.brand}</p>
                                            <p><span className="font-semibold text-gray-400">Model:</span> {product.model}</p>
                                            <p><span className="font-semibold text-gray-400">Năm:</span> {product.year}</p>
                                            <p><span className="font-semibold text-gray-400">Giá:</span> <span className="text-amber-500 font-bold">{formatPrice(product.price)}</span></p>
                                            <p><span className="font-semibold text-gray-400">Tình trạng:</span> {getConditionText(product.condition || '')}</p>
                                            <p><span className="font-semibold text-gray-400">Số lượng:</span> {product.quantity}</p>
                                            <p><span className="font-semibold text-gray-400">Địa điểm:</span> {product.location}</p>
                                            <p><span className="font-semibold text-gray-400">Danh mục:</span> {getCategoryName(product.categoryId)}</p>
                                        </div>
                                    </div>

                                    {/* Status Information */}
                                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                        <h3 className="text-lg font-semibold text-amber-400 mb-3">Trạng thái sản phẩm</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 mb-1">Trạng thái thanh toán</span>
                                                <span className={`px-3 py-2 rounded-lg text-sm font-medium ${getStatusText(product.status).className} border border-gray-600`}>
                                                    {getStatusText(product.status).text}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 mb-1">Trạng thái xác minh</span>
                                                <span className={`px-3 py-2 rounded-lg text-sm font-medium border border-gray-600 ${product.isVerified ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {product.isVerified ? '✓ Đã xác minh' : '✗ Chưa xác minh'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed specs */}
                                    {(product.engineCapacity || product.fuelType || product.mileage || product.color) && (
                                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                            <h3 className="text-lg font-semibold text-amber-400 mb-3">Thông số kỹ thuật</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                                {product.engineCapacity && <li><span className="font-semibold text-gray-400">Dung tích:</span> {product.engineCapacity} cc</li>}
                                                {product.fuelType && <li><span className="font-semibold text-gray-400">Nhiên liệu:</span> {product.fuelType}</li>}
                                                {product.mileage && <li><span className="font-semibold text-gray-400">Đã đi:</span> {product.mileage} km</li>}
                                                {product.color && <li><span className="font-semibold text-gray-400">Màu sắc:</span> {product.color}</li>}
                                                {product.accessoryType && <li><span className="font-semibold text-gray-400">Loại phụ kiện:</span> {product.accessoryType}</li>}
                                                {product.size && <li><span className="font-semibold text-gray-400">Kích thước:</span> {product.size}</li>}
                                                {product.sparePartType && <li><span className="font-semibold text-gray-400">Loại phụ tùng:</span> {product.sparePartType}</li>}
                                                {product.vehicleCompatible && <li><span className="font-semibold text-gray-400">Tương thích:</span> {product.vehicleCompatible}</li>}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                        <h3 className="text-lg font-semibold text-amber-400 mb-2">Mô tả chi tiết</h3>
                                        <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: product.description }} />
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
