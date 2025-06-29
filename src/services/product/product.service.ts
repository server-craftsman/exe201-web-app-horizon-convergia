import { BaseService } from "@app/api/base.service";
import { API_PATH } from "@consts/api.path.const";
import type { ApiResponse } from "@app/interface/apiResponse.interface";
// @ts-ignore
import type { CreateProduct, SendProductPayment, UpdateProduct } from "@types/product/Product.req.type";
// @ts-ignore
import type { ProductResponse } from "@types/product/Product.res.type";

export const ProductService = {
    createProductBySeller(params: CreateProduct) {
        const url = API_PATH.PRODUCT.CREATE_PRODUCT_BY_SELLER(params.sellerId);
        return BaseService.post<ApiResponse<any>>({
            url: url,
            payload: params
        });
    },
    createProductByAdmin(params: CreateProduct) {
        return BaseService.post<ApiResponse<any>>({
            url: API_PATH.PRODUCT.CREATE_PRODUCT,
            payload: params
        });
    },
    getProducts() {
        return BaseService.get<ApiResponse<ProductResponse[]>>({
            url: API_PATH.PRODUCT.GET_ALL_PRODUCTS
        });
    },
    getProductUnverified() {
        return BaseService.get<ApiResponse<ProductResponse[]>>({
            url: API_PATH.PRODUCT.GET_ALL_PRODUCTS_UNVERIFIED
        });
    },
    verifyProduct(id: string) {
        return BaseService.put<ApiResponse<any>>({
            url: API_PATH.PRODUCT.VERIFY_PRODUCT_BY_ADMIN(id)
        });
    },
    activateProduct(productId: string) {
        const url = API_PATH.PRODUCT.ACTIVATE_PRODUCT(productId);
        return BaseService.put<ApiResponse<any>>({
            url: url,
            payload: {
                productId: productId,
            }
        });
    },
    sendProductPayment(params: SendProductPayment) {
        const url = API_PATH.PRODUCT.SEND_PRODUCT_PAYMENT(params.productId);
        return BaseService.post<ApiResponse<any>>({
            url: url,
            payload: params
        });
    },
    getProductById(id: string) {
        return BaseService.get<ApiResponse<ProductResponse>>({
            url: API_PATH.PRODUCT.GET_PRODUCT_BY_ID(id)
        });
    },
    updateProduct(id: string, params: UpdateProduct) {
        return BaseService.put<ApiResponse<any>>({
            url: API_PATH.PRODUCT.UPDATE_PRODUCT(id),
            payload: params
        });
    },
    deleteProduct(id: string) {
        return BaseService.remove<ApiResponse<any>>({
            url: API_PATH.PRODUCT.DELETE_PRODUCT(id)
        });
    }
}
