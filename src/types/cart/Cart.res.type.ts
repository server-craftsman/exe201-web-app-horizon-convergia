export interface CartDetailResponse {
    id: string;
    cartId: string;
    productId: string;
    productName?: string;
    productImage?: string;
    unitPrice: number;
    quantity: number;
    subtotal: number; // unitPrice * quantity
}

export interface CartResponse {
    id: string;
    userId: string;
    totalQuantity: number;
    totalPrice: number;
    createdAt?: string;
    updatedAt?: string;
    details: CartDetailResponse[];
}
