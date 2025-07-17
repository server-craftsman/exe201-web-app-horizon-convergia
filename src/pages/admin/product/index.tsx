import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DisplayProductsAdminComponent,
    AddProductAdminComponent,
    EditProductAdminComponent,
    DeleteProductAdminComponent,
} from '../../../components/admin/product';
import type { ProductResponse } from '../../../types/product/Product.res.type';

// Modal types
type ModalType = 'add' | 'edit' | 'delete' | 'bulk-update' | null;

const ProductManagementPage: React.FC = () => {
    // State management
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<ProductResponse[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Modal handlers
    const openModal = (type: ModalType, product?: ProductResponse) => {
        console.log('Opening modal:', type, product);
        setActiveModal(type);
        if (product) {
            setSelectedProduct(product);
        }
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedProduct(null);
        setSelectedProducts([]);
    };

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
        closeModal();
    };

    // Bulk selection handlers
    const handleBulkSelect = (products: ProductResponse[]) => {
        setSelectedProducts(products);
    };

    const handleBulkUpdate = () => {
        if (selectedProducts.length > 0) {
            openModal('bulk-update');
        }
    };

    const handleBulkDelete = () => {
        if (selectedProducts.length > 0) {
            if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn?`)) {
                // Handle bulk delete logic here
                console.log('Bulk delete:', selectedProducts);
            }
        }
    };

    return (
        <div className="min-h-screen ">
            {/* Header */}
            <div className="backdrop-blur-lg border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Quản lý sản phẩm</h1>
                            <p className="mt-1 text-sm text-gray-400">
                                Quản lý tất cả sản phẩm trong hệ thống
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            {selectedProducts.length > 0 && (
                                <>
                                    <button
                                        onClick={handleBulkUpdate}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md font-medium shadow hover:shadow-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Cập nhật hàng loạt ({selectedProducts.length})
                                    </button>
                                    <button
                                        onClick={handleBulkDelete}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium shadow hover:shadow-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Xóa hàng loạt ({selectedProducts.length})
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => openModal('add')}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-md font-medium shadow hover:shadow-lg transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Thêm sản phẩm
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className=" backdrop-blur-lg border border-gray-700 rounded-lg"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v1m16 0V6a2 2 0 00-2-2H6a2 2 0 00-2 2v1" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Tổng sản phẩm</dt>
                                        <dd className="text-lg font-medium text-gray-900">-</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Đã duyệt</dt>
                                        <dd className="text-lg font-medium text-gray-900">-</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Chờ duyệt</dt>
                                        <dd className="text-lg font-medium text-gray-900">-</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Từ chối</dt>
                                        <dd className="text-lg font-medium text-gray-900">-</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Product Display */}
                <DisplayProductsAdminComponent
                    onEdit={(product) => openModal('edit', product)}
                    onDelete={(product) => {
                        setSelectedProduct(product);
                        openModal('delete');
                    }}
                    refreshTrigger={refreshTrigger}
                    onBulkSelect={handleBulkSelect}
                />
            </div>

            {/* Modals */}
            <AnimatePresence>
                {activeModal === 'add' && (
                    <AddProductAdminComponent
                        onClose={closeModal}
                        onSuccess={handleSuccess}
                    />
                )}

                {activeModal === 'edit' && selectedProduct && (
                    <EditProductAdminComponent
                        product={selectedProduct}
                        onClose={closeModal}
                        onSuccess={handleSuccess}
                    />
                )}

                {activeModal === 'delete' && selectedProduct && (
                    <DeleteProductAdminComponent
                        product={selectedProduct}
                        onClose={closeModal}
                        onSuccess={handleSuccess}
                    />
                )}

            </AnimatePresence>
        </div>
    );
};

export default ProductManagementPage;