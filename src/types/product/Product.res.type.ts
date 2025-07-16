export interface ProductResponse {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    description: string;
    location: string;
    condition: string;
    quantity: number;
    status: number;
    isVerified: boolean;
    createdAt: string;
    sellerId: string;
    categoryId: string;
    imageUrls: string[];
    engineCapacity?: number;
    fuelType?: string;
    mileage?: number;
    color?: string;
    accessoryType?: string;
    size?: string;
    sparePartType?: string;
    vehicleCompatible?: string;
}
