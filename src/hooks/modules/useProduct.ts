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

    // Create product mutation
    const createProductMutation = useMutation({
        mutationFn: (productData: any) => ProductService.createProduct(productData),
        onSuccess: () => {
            // Invalidate and refetch products list
            queryClient.invalidateQueries({ queryKey: ['products'] });
            notificationMessage('Tạo sản phẩm thành công!', 'success');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm';
            notificationMessage(errorMessage, 'error');
        },
    });

    // Get products by seller query
    const useProductsBySeller = (sellerId: string) => {
        return useQuery({
            queryKey: ['products', 'seller', sellerId],
            queryFn: () => ProductService.getProducts(),
            select: (data) => data.data.data,
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

        // Create product
        createProduct: createProductMutation.mutate,
        isCreatingProduct: createProductMutation.isPending,
        createProductError: createProductMutation.error,

        // Utilities
        useProductsBySeller,
    };
};

export default useProduct;
