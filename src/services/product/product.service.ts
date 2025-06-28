import { BaseService } from "@app/api/base.service";
import { API_PATH } from "@consts/api.path.const";
import type { ApiResponse } from "@app/interface/apiResponse.interface";
// @ts-ignore
import type { CreateProduct } from "@types/product/Product.req.type";
// @ts-ignore
import type { ProductResponse } from "@types/product/Product.res.type";

export const ProductService = {
    createProduct(params: CreateProduct) {
        const url = API_PATH.PRODUCT.CREATE_PRODUCT_BY_SELLER(params.sellerId);
        return BaseService.post<ApiResponse<any>>({
            url: url,
            payload: params
        });
    },
    getProducts() {
        return BaseService.get<ApiResponse<ProductResponse[]>>({
            url: API_PATH.PRODUCT.GET_ALL_PRODUCTS
        });
    },

}
