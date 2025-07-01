import { BaseService } from "@app/api/base.service";
import { API_PATH } from "@consts/api.path.const";
import type { ApiResponse } from "@app/interface/apiResponse.interface";
import type {
    CreateProduct,
    SendProductPayment,
    UpdateProduct,
    FilterProduct
    // VerifyProduct,
    // ActivateProduct,
    // DeleteProduct
} from "../../types/product/Product.req.type";
import type { ProductResponse } from "../../types/product/Product.res.type";

export const ProductService = {
    // Create product by seller
    createProductBySeller(params: CreateProduct) {
        const url = API_PATH.PRODUCT.CREATE_PRODUCT_BY_SELLER(params.sellerId || '');
        return BaseService.post<ApiResponse<ProductResponse>>({
            url: url,
            payload: params
        });
    },

    // Create product by admin
    createProductByAdmin(params: CreateProduct) {
        return BaseService.post<ApiResponse<ProductResponse>>({
            url: API_PATH.PRODUCT.CREATE_PRODUCT,
            payload: params
        });
    },

    // Get all products
    getProducts(params: FilterProduct) {
        const queryParams = new URLSearchParams();
        if (params.categoryId) queryParams.append('categoryId', params.categoryId);
        if (params.sortField) queryParams.append('sortField', params.sortField);
        if (params.ascending !== undefined) queryParams.append('ascending', params.ascending.toString());
        return BaseService.get<ApiResponse<ProductResponse[]>>({
            url: `${API_PATH.PRODUCT.GET_ALL_PRODUCTS}?${queryParams.toString()}`,
        });
    },

    // Get unverified-unpaid products (main endpoint for DisplayProducts)
    getProductUnverified() {
        return BaseService.get<ProductResponse[]>({
            url: API_PATH.PRODUCT.GET_ALL_PRODUCTS_UNVERIFIED,
            isLoading: false // Disable global loading for this query
        });
    },

    // Get product by ID
    getProductById(id: string) {
        return BaseService.get<ApiResponse<ProductResponse>>({
            url: API_PATH.PRODUCT.GET_PRODUCT_BY_ID(id)
        });
    },

    // Update product
    updateProduct(id: string, params: UpdateProduct) {
        return BaseService.put<ApiResponse<ProductResponse>>({
            url: API_PATH.PRODUCT.UPDATE_PRODUCT(id),
            payload: params
        });
    },

    // Delete product
    deleteProduct(id: string) {
        return BaseService.remove<ApiResponse<void>>({
            url: API_PATH.PRODUCT.DELETE_PRODUCT(id)
        });
    },

    // Verify product by admin
    verifyProduct(id: string) {
        return BaseService.put<ApiResponse<ProductResponse>>({
            url: API_PATH.PRODUCT.VERIFY_PRODUCT_BY_ADMIN(id)
        });
    },

    // Activate product
    activateProduct(productId: string) {
        const url = API_PATH.PRODUCT.ACTIVATE_PRODUCT(productId);
        return BaseService.put<ApiResponse<ProductResponse>>({
            url: url,
            payload: {
                productId: productId,
            }
        });
    },

    // Send product payment link
    sendProductPayment(params: SendProductPayment) {
        const url = API_PATH.PRODUCT.SEND_PRODUCT_PAYMENT(params.productId);
        return BaseService.post<ApiResponse<{ paymentUrl: string }>>({
            url: url,
            payload: {
                productId: params.productId,
                returnUrl: params.returnUrl
            }
        });
    },

    // Utility methods for better data handling
    filterProductsBySeller(products: ProductResponse[], sellerId: string): ProductResponse[] {
        return products.filter(product => product.sellerId === sellerId);
    },

    filterProductsByStatus(products: ProductResponse[], status: number): ProductResponse[] {
        return products.filter(product => product.status === status);
    },

    filterProductsByVerification(products: ProductResponse[], isVerified: boolean): ProductResponse[] {
        return products.filter(product => product.isVerified === isVerified);
    },

    // Status helpers
    getStatusText(status: number): string {
        const statusMap = {
            0: 'Nháp',
            1: 'Chờ duyệt',
            2: 'Chờ thanh toán',
            3: 'Đã thanh toán',
            4: 'Đã duyệt',
            5: 'Từ chối'
        };
        return statusMap[status as keyof typeof statusMap] || 'Không xác định';
    },

    getStatusColor(status: number): string {
        const colorMap = {
            0: 'text-gray-400',
            1: 'text-yellow-400',
            2: 'text-orange-400',
            3: 'text-green-400',
            4: 'text-blue-400',
            5: 'text-red-400'
        };
        return colorMap[status as keyof typeof colorMap] || 'text-gray-400';
    }
}
