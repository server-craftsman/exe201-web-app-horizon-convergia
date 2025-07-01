import React from 'react';
import { motion } from 'framer-motion';
import { ProductService } from '../../../services/product/product.service';
import type { ProductResponse } from '../../../types/product/Product.res.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteProductAdminProps {
    product: ProductResponse;
    onClose: () => void;
    onSuccess: () => void;
}

export const DeleteProductAdminComponent: React.FC<DeleteProductAdminProps> = ({
    product,
    onClose,
    onSuccess
}) => {
    const queryClient = useQueryClient();

    // Delete product mutation
    const deleteProductMutation = useMutation({
        mutationFn: (id: string) => ProductService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            onSuccess();
            onClose();
        },
        onError: (error: any) => {
            console.error('Error deleting product:', error);
            alert(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm');
        }
    });

    const handleDelete = () => {
        deleteProductMutation.mutate(product.id);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getCategoryName = (categoryId: string) => {
        const categories = {
            '1': 'Xe máy',
            '2': 'Phụ kiện',
            '3': 'Phụ tùng'
        };
        return categories[categoryId as keyof typeof categories] || 'Khác';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 20 }}
                className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md"
            >
                <div className="border-b bg-gradient-to-r from-amber-500 to-amber-600 border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Xác nhận xóa sản phẩm</h2>
                    <button
                        onClick={onClose}
                        disabled={deleteProductMutation.isPending}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">
                            Bạn có chắc chắn muốn xóa sản phẩm này?
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống.
                        </p>
                    </div>

                    {/* Product Info */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {product.imageUrls && product.imageUrls.length > 0 ? (
                                    <img
                                        src={product.imageUrls[0]}
                                        alt={`${product.brand} ${product.model}`}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-white truncate">
                                    {product.brand} {product.model}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {getCategoryName(product.categoryId)} • Năm {product.year}
                                </p>
                                <p className="text-sm font-medium text-amber-600">
                                    {formatPrice(product.price)}
                                </p>
                                <p className="text-xs text-gray-400">
                                    ID: {product.id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={deleteProductMutation.isPending}
                            className="flex-1 px-4 py-2.5 bg-gray-500 text-white font-medium rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleteProductMutation.isPending}
                            className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition disabled:opacity-50"
                        >
                            {deleteProductMutation.isPending ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang xóa...
                                </div>
                            ) : (
                                'Xóa sản phẩm'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
