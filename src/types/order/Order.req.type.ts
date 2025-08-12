export interface CreateOrderFromCartRequest {
    cartDetailIds: string[]; // mảng cart detail id theo swagger
    shippingAddress: string;
    discount?: number;
}

export interface SearchOrdersQuery {
    buyerId?: string;
    sellerId?: string;
    status?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7; // theo swagger available values
    page?: number;
    pageSize?: number;
    minTotalPrice?: number;
    maxTotalPrice?: number;
    fromDate?: string; // ISO
    toDate?: string; // ISO
}
