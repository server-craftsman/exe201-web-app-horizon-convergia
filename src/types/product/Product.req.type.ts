export interface CreateProduct {
    brand: string;
    model: string;
    year: number;
    price: number;
    description: string;
    location: string;
    condition: string;
    quantity: number;
    sellerId?: string | null;
    categoryId: string;
    imageUrls?: string[];
    videoUrl?: string;
    // detailed specifications
    engineCapacity?: number;
    fuelType?: string;
    mileage?: number;
    color?: string;
    accessoryType?: string;
    size?: string;
    sparePartType?: string;
    vehicleCompatible?: string;
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
    engineCapacity?: number;
    fuelType?: string;
    mileage?: number;
    color?: string;
    accessoryType?: string;
    size?: string;
    sparePartType?: string;
    vehicleCompatible?: string;
}

export interface FilterProduct {
    categoryId: string;
    sortField: string;
    ascending: boolean;
    pageNumber?: number;
    pageSize?: number;
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