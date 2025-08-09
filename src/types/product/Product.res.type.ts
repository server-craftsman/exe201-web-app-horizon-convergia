export interface ProductResponse {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    description: string;
    location?: string;
    condition?: string;
    quantity: number;
    engineCapacity?: number | null;
    fuelType?: string;
    mileage?: number | null;
    color?: string;
    accessoryType?: string;
    size?: string;
    sparePartType?: string;
    vehicleCompatible?: string;
    status: number;
    isVerified: boolean;
    createdAt: string;
    sellerId: string;
    categoryId: string;
    imageUrls: string[];
    // ... any extra dynamic fields
}

// AI Product Analysis (Chat Box) response
export interface ProductAnalysisChatResponse {
    suggestionTitle?: string;
    suggestionDescription?: string;
    estimatedPrice?: number;
    tags?: string[];
    reasoning?: string;
}
