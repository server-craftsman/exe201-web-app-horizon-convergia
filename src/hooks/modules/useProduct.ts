import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../../services/product/product.service';
import { BaseService } from '../../app/api/base.service';
import { notificationMessage } from '../../utils/helper';
import type { ProductResponse } from '../../types/product/Product.res.type';
import type { CreateProduct, UpdateProduct, SendProductPayment } from '../../types/product/Product.req.type';

export const useProduct = () => {
    const queryClient = useQueryClient();

    // Get all products query
    const useProducts = ({
        categoryId = '',
        location = '',
        sortField = 'createdAt',
        ascending = false,
        pageNumber = 1,
        pageSize = 10
    } = {}) => {
        return useQuery({
            queryKey: ['products', categoryId, location, sortField, ascending, pageNumber, pageSize],
            queryFn: () => ProductService.getProducts({
                categoryId,
                location,
                sortField,
                ascending,
                pageNumber,
                pageSize
            }),
            select: (data) => data.data as ProductResponse[],
            staleTime: 5 * 60 * 1000, // 5 minutes
        });
    };

    // Remove the broken unverifiedProducts query (it references undefined sellerId)
    // Instead, provide a hook to fetch unverified products by sellerId

    // Get unverified products by sellerId, hỗ trợ filter
    const useUnverifiedProductsBySeller = (sellerId: string, filter?: {
        categoryId?: string;
        location?: string;
        sortField?: string;
        ascending?: boolean;
        pageNumber?: number;
        pageSize?: number;
    }) => {
        return useQuery({
            queryKey: ['products', 'unverified-unpaid', sellerId, filter],
            queryFn: () => ProductService.getProductUnverified(sellerId, {
                categoryId: filter?.categoryId || '',
                location: filter?.location || '',
                sortField: filter?.sortField || 'createdAt',
                ascending: filter?.ascending ?? false,
                pageNumber: filter?.pageNumber,
                pageSize: filter?.pageSize,
            }),
            select: (data) => data.data as ProductResponse[],
            enabled: !!sellerId,
            staleTime: 2 * 60 * 1000, // 2 minutes
            refetchOnMount: true,
            refetchOnWindowFocus: false,
        });
    };

    // Get product by ID query
    const useProductById = (id: string) => {
        return useQuery({
            queryKey: ['products', id],
            queryFn: () => ProductService.getProductById(id),
            select: (data) => data.data.data as ProductResponse,
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        });
    };

    // // Get products by seller query - Updated to use dedicated API endpoint
    // const useProductsBySeller = (sellerId: string) => {
    //     return useQuery({
    //         queryKey: ['products', 'seller', sellerId],
    //         queryFn: () => ProductService.getProductsBySeller(sellerId),
    //         select: (data) => data.data.data,
    //         enabled: !!sellerId,
    //         staleTime: 5 * 60 * 1000,
    //     });
    // };

    // File upload mutation
    const uploadFileMutation = useMutation({
        mutationFn: ({ file, type }: { file: File; type: "video" | "image" }) =>
            BaseService.uploadFile(file, type),
        onError: (error: any) => {
            const errorMessage = error?.message || 'Có lỗi xảy ra khi tải file';
            notificationMessage(errorMessage, 'error');
        },
    });

    // File delete mutation
    const deleteFileMutation = useMutation({
        mutationFn: ({ publicId, type }: { publicId: string; type: "video" | "image" }) =>
            BaseService.deleteFile(publicId, type),
        onError: (error: any) => {
            const errorMessage = error?.message || 'Có lỗi xảy ra khi xóa file';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Create product by seller mutation
    const createProductBySellerMutation = useMutation({
        mutationFn: (productData: CreateProduct) => ProductService.createProductBySeller(productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', 'unverified-unpaid'] });
            notificationMessage('Tạo sản phẩm thành công!', 'success');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Create product by admin mutation
    const createProductByAdminMutation = useMutation({
        mutationFn: ({ adminId, productData }: { adminId: string; productData: CreateProduct }) =>
            ProductService.createProductByAdmin(adminId, productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', 'unverified-unpaid'] });
            notificationMessage('Tạo sản phẩm thành công!', 'success');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Update product mutation
    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProduct }) => ProductService.updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', 'unverified-unpaid'] });
            notificationMessage('Cập nhật sản phẩm thành công!', 'success');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Delete product mutation
    const deleteProductMutation = useMutation({
        mutationFn: (id: string) => ProductService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', 'unverified-unpaid'] });
            notificationMessage('Xóa sản phẩm thành công!', 'success');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Verify product mutation
    const verifyProductMutation = useMutation({
        mutationFn: (id: string) => ProductService.verifyProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', 'unverified-unpaid'] });
            notificationMessage('Xác thực sản phẩm thành công!', 'success');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi xác thực sản phẩm';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Activate product mutation
    const activateProductMutation = useMutation({
        mutationFn: (productId: string) => ProductService.activateProduct(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', 'unverified-unpaid'] });
            notificationMessage('Kích hoạt sản phẩm thành công!', 'success');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi kích hoạt sản phẩm';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Send product payment mutation
    const sendProductPaymentMutation = useMutation({
        mutationFn: (params: SendProductPayment) => ProductService.sendProductPayment(params),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', 'unverified-unpaid'] });

            // If payment URL is returned, open it in new window
            const paymentUrl = response?.data?.data?.paymentUrl;
            if (paymentUrl) {
                window.open(paymentUrl, '_blank');
                notificationMessage('Đã mở link thanh toán trong tab mới!', 'success');
            } else {
                notificationMessage('Gửi link thanh toán thành công!', 'success');
            }
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi gửi thanh toán';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Utility functions for filtering
    // Remove getProductsBySeller, getProductsByStatus, getProductsByVerification referencing unverifiedProducts
    // If needed, these should be implemented as pure functions taking products as argument

    // Example: (leave as pure functions for consumers to use)
    const filterProductsBySeller = (products: ProductResponse[], sellerId: string): ProductResponse[] => {
        return ProductService.filterProductsBySeller(products, sellerId);
    };
    const filterProductsByStatus = (products: ProductResponse[], status: number): ProductResponse[] => {
        return ProductService.filterProductsByStatus(products, status);
    };
    const filterProductsByVerification = (products: ProductResponse[], isVerified: boolean): ProductResponse[] => {
        return ProductService.filterProductsByVerification(products, isVerified);
    };

    return {
        // Products data
        useProducts,
        isLoadingProducts: useProducts().isLoading, // This will be undefined as useProducts is a hook
        productsError: useProducts().error, // This will be undefined
        refetchProducts: useProducts().refetch, // This will be undefined

        // Remove unverifiedProducts, isLoadingUnverifiedProducts, unverifiedProductsError, refetchUnverifiedProducts from return

        // Add the new hook
        useUnverifiedProductsBySeller,

        // Create product by seller
        createProductBySeller: createProductBySellerMutation.mutate,
        createProductBySellerAsync: createProductBySellerMutation.mutateAsync,
        isCreatingProduct: createProductBySellerMutation.isPending,
        createProductError: createProductBySellerMutation.error,

        // Create product by admin
        createProductByAdmin: createProductByAdminMutation.mutate,
        createProductByAdminAsync: createProductByAdminMutation.mutateAsync,
        isCreatingProductByAdmin: createProductByAdminMutation.isPending,
        createProductByAdminError: createProductByAdminMutation.error,

        // Update product
        updateProduct: updateProductMutation.mutate,
        updateProductAsync: updateProductMutation.mutateAsync,
        isUpdatingProduct: updateProductMutation.isPending,
        updateProductError: updateProductMutation.error,

        // Delete product
        deleteProduct: deleteProductMutation.mutate,
        deleteProductAsync: deleteProductMutation.mutateAsync,
        isDeletingProduct: deleteProductMutation.isPending,
        deleteProductError: deleteProductMutation.error,

        // Verify product
        verifyProduct: verifyProductMutation.mutate,
        verifyProductAsync: verifyProductMutation.mutateAsync,
        isVerifyingProduct: verifyProductMutation.isPending,
        verifyProductError: verifyProductMutation.error,

        // Activate product
        activateProduct: activateProductMutation.mutate,
        activateProductAsync: activateProductMutation.mutateAsync,
        isActivatingProduct: activateProductMutation.isPending,
        activateProductError: activateProductMutation.error,

        // Send product payment
        sendProductPayment: sendProductPaymentMutation.mutate,
        sendProductPaymentAsync: sendProductPaymentMutation.mutateAsync,
        isSendingPayment: sendProductPaymentMutation.isPending,
        sendPaymentError: sendProductPaymentMutation.error,

        // Utilities
        useProductById,
        // getProductsBySeller, // This line is removed
        // getProductsByStatus, // This line is removed
        // getProductsByVerification, // This line is removed

        // Filtering utilities (pure functions)
        filterProductsBySeller,
        filterProductsByStatus,
        filterProductsByVerification,

        // File upload
        uploadFile: uploadFileMutation.mutate,
        uploadFileAsync: uploadFileMutation.mutateAsync,
        isUploadingFile: uploadFileMutation.isPending,
        uploadFileError: uploadFileMutation.error,

        // File delete
        deleteFile: deleteFileMutation.mutate,
        deleteFileAsync: deleteFileMutation.mutateAsync,
        isDeletingFile: deleteFileMutation.isPending,
        deleteFileError: deleteFileMutation.error,

        // Helper functions from service
        getStatusText: ProductService.getStatusText,
        getStatusColor: ProductService.getStatusColor,
    };
};

export default useProduct;
