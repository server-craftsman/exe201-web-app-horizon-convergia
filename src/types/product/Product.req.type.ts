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
    brand: string;
    model: string;
    year: number;
    price: number;
}

export interface SendProductPayment {
    productId: string;
    returnUrl: string;
}

export interface VerifyProduct {
    productId: string;
    sellerId: string;
}

export interface ActivateProduct {
    productId: string;
    sellerId: string;
}

export interface DeleteProduct {
    productId: string;
    sellerId: string;
}