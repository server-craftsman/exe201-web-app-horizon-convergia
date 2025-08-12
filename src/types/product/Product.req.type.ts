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
    categoryId?: string;
    brand?: string;
    model?: string;
    year?: number;
    minPrice?: number;
    maxPrice?: number;
    description?: string;
    location?: string;
    condition?: string;
    quantity?: number;
    engineCapacity?: number;
    fuelType?: string;
    mileage?: number;
    color?: string;
    accessoryType?: string;
    size?: string;
    sparePartType?: string;
    vehicleCompatible?: string;
    sortField?: string;
    ascending?: boolean;
    pageNumber?: number;
    pageSize?: number;
    // optional extras
    status?: number;
    isVerified?: boolean;
}

// Chỉ dùng cho bộ lọc Favorites: giới hạn key cần thiết
export type FavoriteFilter = Pick<FilterProduct,
    'brand' | 'model' | 'year' | 'condition' | 'location' | 'minPrice' | 'maxPrice' | 'color' | 'sortField' | 'ascending' | 'pageNumber' | 'pageSize'
>;

// AI Product Analysis (Chat Box) request
export interface ProductAnalysisChatRequest {
    image?: File | Blob | null;
    description?: string;
    userId?: string;
}

export interface SendProductPayment {
    productId: string;
    // returnUrl: string;
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