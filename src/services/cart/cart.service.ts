import { BaseService } from "@app/api/base.service";
import { API_PATH } from "@consts/api.path.const";
import type { ApiResponse } from "@app/interface/apiResponse.interface";
import type { CartResponse, CartDetailResponse, RawCartResponse } from "../../types/cart/Cart.res.type";

function mapRawToCart(raw?: RawCartResponse): CartResponse {
    if (!raw) {
        return { id: '', userId: '', totalQuantity: 0, totalPrice: 0, details: [] };
    }

    // Prefer detailed cartDetails when available
    let details: CartDetailResponse[] = [];

    if (Array.isArray(raw.cartDetails) && raw.cartDetails.length > 0) {
        details = raw.cartDetails.map(d => ({
            id: d.id,
            cartId: d.cartId,
            productId: d.productId,
            productName: d.product ? `${d.product.brand || ''} ${d.product.model || ''}`.trim() : undefined,
            productImage: d.product?.imageUrls?.[0],
            productDescription: d.product?.description,
            unitPrice: d.price ?? d.product?.price ?? 0,
            quantity: d.quantity,
            subtotal: (d.price ?? d.product?.price ?? 0) * d.quantity,
        }));
    } else if (Array.isArray(raw.items) && raw.items.length > 0) {
        // Map summary shape; unitPrice/subtotal unknown → set 0 and handle display gracefully
        details = raw.items.map((it) => ({
            id: `${raw.id}:${it.productId}`,
            cartId: raw.id,
            productId: it.productId,
            productName: it.productName,
            productImage: undefined,
            productDescription: undefined,
            unitPrice: 0,
            quantity: it.quantity,
            subtotal: 0,
        }));
    }

    const totalQuantity = details.reduce((s, x) => s + x.quantity, 0);
    const totalPrice = details.reduce((s, x) => s + (x.subtotal || 0), 0);
    return {
        id: raw.id,
        userId: raw.buyerId,
        totalQuantity,
        totalPrice,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        details,
    };
}

export const CartService = {
    // GET /Carts/user/{userId}
    getCartByUser(userId: string) {
        return BaseService.get<RawCartResponse>({
            url: API_PATH.CART.GET_BY_USER(userId),
        });
    },

    // POST /Carts/{userId}/add/{productId}?quantity={quantity}
    addToCart(userId: string, productId: string, quantity: number = 1) {
        return BaseService.post<ApiResponse<RawCartResponse>>({
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
        const qty = Math.max(1, Math.trunc(Number(newQuantity) || 0));
        return BaseService.put<ApiResponse<CartDetailResponse>>({
            url: API_PATH.CART.UPDATE_DETAIL_QUANTITY(cartDetailId, qty),
        });
    },

    // helper mappers
    mapRawToCart,
};