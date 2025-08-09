import { BaseService } from "@app/api/base.service";
import { API_PATH } from "@consts/api.path.const";
import type { ApiResponse } from "@app/interface/apiResponse.interface";
import type { CartResponse, CartDetailResponse } from "../../types/cart/Cart.res.type";

export const CartService = {
    // GET /Carts/user/{userId}
    getCartByUser(userId: string) {
        return BaseService.get<ApiResponse<CartResponse>>({
            url: API_PATH.CART.GET_BY_USER(userId),
        });
    },

    // POST /Carts/{userId}/add/{productId}?quantity={quantity}
    addToCart(userId: string, productId: string, quantity: number = 1) {
        return BaseService.post<ApiResponse<CartResponse>>({
            url: API_PATH.CART.ADD(userId, productId, quantity),
        });
    },

    // GET /Carts/{cartId}/details
    getCartDetails(cartId: string) {
        return BaseService.get<ApiResponse<CartDetailResponse[]>>({
            url: API_PATH.CART.GET_DETAILS(cartId),
        });
    },

    // DELETE /Carts/detail/{cartDetailId}
    deleteCartDetail(cartDetailId: string) {
        return BaseService.remove<ApiResponse<void>>({
            url: API_PATH.CART.DELETE_DETAIL(cartDetailId),
        });
    },

    // PUT /Carts/detail/{cartDetailId}/quantity/{newQuantity}
    updateCartDetailQuantity(cartDetailId: string, newQuantity: number) {
        return BaseService.put<ApiResponse<CartDetailResponse>>({
            url: API_PATH.CART.UPDATE_DETAIL_QUANTITY(cartDetailId, newQuantity),
        });
    },
};