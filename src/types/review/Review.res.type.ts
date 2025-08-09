export interface ReviewResponse {
    id: string;
    comment: string;
    rating: number;
    productId: string;
    userId: string;
    createdAt: string;
    updatedAt?: string;
    isDeleted?: boolean;
}

export interface PagedReviewResponse {
    items: ReviewResponse[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}
