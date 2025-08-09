export interface AddToCartPath {
    userId: string;
    productId: string;
}

export interface AddToCartQuery {
    quantity?: number; // default 1
}

export interface UpdateCartDetailQuantityPath {
    cartDetailId: string;
    newQuantity: number;
}

export interface DeleteCartDetailPath {
    cartDetailId: string;
}

export interface GetCartByUserPath {
    userId: string;
}

export interface GetCartDetailsPath {
    cartId: string;
}
