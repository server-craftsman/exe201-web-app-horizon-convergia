export interface CartDetailResponse {
    id: string;
    cartId: string;
    productId: string;
    productName?: string;
    productImage?: string;
    productDescription?: string;
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

// Raw shapes from backend
export interface RawCartProduct {
    id: string;
    brand?: string;
    model?: string;
    price?: number;
    imageUrls?: string[];
    description?: string;
}

export interface RawCartItemSummary {
    productId: string;
    productName?: string;
    quantity: number;
}

export interface RawCartDetailResponse {
    id: string;
    quantity: number;
    price: number;
    discount?: number | null;
    cartId: string;
    productId: string;
    product?: RawCartProduct | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface RawCartResponse {
    id: string;
    buyerId: string;
    buyer?: any;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    cartDetails?: RawCartDetailResponse[]; // old detailed shape
    items?: RawCartItemSummary[]; // new summary shape per user’s response
}
