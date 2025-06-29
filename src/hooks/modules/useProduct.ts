import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../../services/product/product.service';
import { notificationMessage } from '../../utils/helper';

export const useProduct = () => {
    const queryClient = useQueryClient();

    // Get all products query
    const {
        data: products,
        isLoading: isLoadingProducts,
        error: productsError,
        refetch: refetchProducts
    } = useQuery({
        queryKey: ['products'],
        queryFn: () => ProductService.getProducts(),
        select: (data) => data.data.data,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Get unverified products query
    const {
        data: unverifiedProducts,
        isLoading: isLoadingUnverifiedProducts,
        error: unverifiedProductsError,
        refetch: refetchUnverifiedProducts
    } = useQuery({
        queryKey: ['products', 'unverified'],
        queryFn: () => ProductService.getProductUnverified(),
        select: (data) => data.data.data,
        staleTime: 5 * 60 * 1000,
    });

    // Get product by ID query
    const useProductById = (id: string) => {
        return useQuery({
            queryKey: ['products', id],
            queryFn: () => ProductService.getProductById(id),
            select: (data) => data.data.data,
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        });
    };

    // Create product by seller mutation
    const createProductBySellerMutation = useMutation({
        mutationFn: (productData: any) => ProductService.createProductBySeller(productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            notificationMessage('Tạo sản phẩm thành công!', 'success');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Create product by admin mutation
    const createProductByAdminMutation = useMutation({
        mutationFn: (productData: any) => ProductService.createProductByAdmin(productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            notificationMessage('Tạo sản phẩm thành công!', 'success');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Update product mutation
    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => ProductService.updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
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
            queryClient.invalidateQueries({ queryKey: ['products', 'unverified'] });
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
            notificationMessage('Kích hoạt sản phẩm thành công!', 'success');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi kích hoạt sản phẩm';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Send product payment mutation
    const sendProductPaymentMutation = useMutation({
        mutationFn: (params: any) => ProductService.sendProductPayment(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            notificationMessage('Gửi thanh toán thành công!', 'success');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi gửi thanh toán';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Get products by seller query
    const useProductsBySeller = (sellerId: string) => {
        return useQuery({
            queryKey: ['products', 'seller', sellerId],
            queryFn: () => ProductService.getProducts(),
            select: (data) => data.data.data?.filter((product: any) => product.sellerId === sellerId),
            enabled: !!sellerId,
            staleTime: 5 * 60 * 1000,
        });
    };

    return {
        // Products data
        products,
        isLoadingProducts,
        productsError,
        refetchProducts,

        // Unverified products data
        unverifiedProducts,
        isLoadingUnverifiedProducts,
        unverifiedProductsError,
        refetchUnverifiedProducts,

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
        useProductsBySeller,
    };
};

export default useProduct;
