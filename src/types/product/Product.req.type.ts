export interface CreateProduct {
    brand: string;
    model: string;
    year: number;
    price: number;
    description: string;
    location: string;
    condition: string;
    quantity: number;
    sellerId: string;
    categoryId: string;
    imageUrls?: string[];
}

export interface UpdateProduct {
    brand?: string;
    model?: string;
    year?: number;
    price?: number;
    description?: string;
    location?: string;
    condition?: string;
    quantity?: number;
    categoryId?: string;
    imageUrls?: string[];
}

export interface SendProductPayment {
    productId: string;
    returnUrl: string;
}

export interface VerifyProduct {
    productId: string;
}

export interface ActivateProduct {
    productId: string;
}

export interface DeleteProduct {
    productId: string;
}

// Additional interfaces for better type safety
export interface ProductFilter {
    sellerId?: string;
    categoryId?: string;
    status?: number;
    isVerified?: boolean;
}

export interface ProductStatus {
    DRAFT: 0;
    PENDING_APPROVAL: 1;
    PENDING_PAYMENT: 2;
    PAID: 3;
    APPROVED: 4;
    REJECTED: 5;
}