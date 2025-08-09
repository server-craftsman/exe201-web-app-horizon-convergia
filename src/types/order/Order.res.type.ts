export interface OrderItemResponse {
    id: string;
    productId: string;
    productName?: string;
    productImage?: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
}

export type OrderStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7; // theo swagger available values

export interface OrderResponse {
    id: string;
    buyerId: string;
    sellerId?: string;
    createdAt: string;
    status: OrderStatus;
    totalPrice: number;
    shippingAddress?: string;
    discount?: number;
    items: OrderItemResponse[];
}

export interface PagedOrderResponse {
    items: OrderResponse[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}
