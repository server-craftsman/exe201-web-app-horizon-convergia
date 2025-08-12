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
import type { ProductAnalysisChatRequest, } from "../../types/product/Product.req.type";
import type { ProductAnalysisChatResponse } from "../../types/product/Product.res.type";

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
    createProductByAdmin(adminId: string, params: CreateProduct) {
        return BaseService.post<ApiResponse<ProductResponse>>({
            url: API_PATH.PRODUCT.CREATE_PRODUCT(adminId),
            payload: params
        });
    },

    // Get all products
    getProducts(params: FilterProduct) {
        const queryParams = new URLSearchParams();
        if (params.categoryId) queryParams.append('categoryId', params.categoryId);
        if (params.brand) queryParams.append('brand', params.brand);
        if (params.model) queryParams.append('model', params.model);
        if (params.year !== undefined) queryParams.append('year', params.year.toString());
        if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
        if (params.description) queryParams.append('description', params.description);
        if (params.location) queryParams.append('location', params.location);
        if (params.condition) queryParams.append('condition', params.condition);
        if (params.quantity !== undefined) queryParams.append('quantity', params.quantity.toString());
        if (params.engineCapacity !== undefined) queryParams.append('engineCapacity', params.engineCapacity.toString());
        if (params.fuelType) queryParams.append('fuelType', params.fuelType);
        if (params.mileage !== undefined) queryParams.append('mileage', params.mileage.toString());
        if (params.color) queryParams.append('color', params.color);
        if (params.accessoryType) queryParams.append('accessoryType', params.accessoryType);
        if (params.size) queryParams.append('size', params.size);
        if (params.sparePartType) queryParams.append('sparePartType', params.sparePartType);
        if (params.vehicleCompatible) queryParams.append('vehicleCompatible', params.vehicleCompatible);
        if (params.sortField) queryParams.append('sortField', params.sortField);
        if (params.ascending !== undefined) queryParams.append('ascending', params.ascending.toString());
        if (params.pageNumber !== undefined) queryParams.append('pageNumber', params.pageNumber.toString());
        if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
        // Extra filters if backend supports them
        const anyParams = params as any;
        if (typeof anyParams.status !== 'undefined') queryParams.append('status', String(anyParams.status));
        if (typeof anyParams.isVerified !== 'undefined') queryParams.append('isVerified', String(anyParams.isVerified));
        return BaseService.get<ProductResponse[]>({
            url: `${API_PATH.PRODUCT.GET_ALL_PRODUCTS}?${queryParams.toString()}`,
        });
    },

    // Get unverified-unpaid products (main endpoint for DisplayProducts)
    getProductUnverified(sellerId: string, params: FilterProduct) {
        const queryParams = new URLSearchParams();
        if (params.categoryId) queryParams.append('categoryId', params.categoryId);
        if (params.sortField) queryParams.append('sortField', params.sortField);
        if (params.ascending !== undefined) queryParams.append('ascending', params.ascending.toString());
        if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        return BaseService.get<ProductResponse[]>({
            url: `${API_PATH.PRODUCT.GET_ALL_PRODUCTS_UNVERIFIED(sellerId)}?${queryParams.toString()}`,

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

    // Favorite APIs
    addFavorite(productId: string, userId: string) {
        return BaseService.post<ApiResponse<void>>({
            url: API_PATH.PRODUCT.ADD_FAVORITE(productId, userId)
        });
    },
    removeFavorite(productId: string, userId: string) {
        return BaseService.remove<ApiResponse<void>>({
            url: API_PATH.PRODUCT.REMOVE_FAVORITE(productId, userId)
        });
    },
    getFavorites(userId: string, query?: Partial<FilterProduct>) {
        // Chỉ pick các trường cần thiết để lọc favorites nhằm tránh query quá tải
        const allowedKeys: (keyof FilterProduct)[] = ['brand', 'model', 'year', 'condition', 'location', 'minPrice', 'maxPrice', 'color', 'sortField', 'ascending', 'pageNumber', 'pageSize'];
        const payload: Record<string, any> = {};
        if (query) {
            for (const k of allowedKeys) {
                const v = (query as any)[k];
                if (typeof v !== 'undefined' && v !== null && v !== '') payload[k] = v;
            }
        }
        return BaseService.get<ProductResponse[]>({
            url: API_PATH.PRODUCT.GET_FAVORITES(userId),
            payload
        });
    },

    // AI: Product Analysis Chat Box (multipart/form-data)
    analyzeProductWithAI(params: ProductAnalysisChatRequest) {
        const form = new FormData();
        if (params.image) form.append('Image', params.image);
        if (params.description) form.append('Description', params.description);
        if (params.userId) form.append('UserId', params.userId);
        return BaseService.post<ApiResponse<ProductAnalysisChatResponse>>({
            url: API_PATH.AI.PRODUCT_ANALYSIS_CHAT_BOX,
            payload: form,
            headers: { 'Content-Type': 'multipart/form-data' }
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
        const url = API_PATH.PRODUCT.SEND_PRODUCT_PAYMENT;
        return BaseService.post<ApiResponse<{ paymentUrl: string }>>({
            url: url,
            payload: params
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
