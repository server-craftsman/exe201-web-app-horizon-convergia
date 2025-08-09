export interface CreateReviewRequest {
    comment: string;
    rating: number;
    productId: string;
    userId: string;
    createdAt?: string;
    isDeleted?: boolean;
}

export interface UpdateReviewRequest extends Partial<CreateReviewRequest> { }
