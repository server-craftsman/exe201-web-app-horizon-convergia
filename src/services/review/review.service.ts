import { BaseService } from "@app/api/base.service";
import { API_PATH } from "@consts/api.path.const";
import type { ApiResponse } from "@app/interface/apiResponse.interface";
import type { CreateReviewRequest, UpdateReviewRequest } from "../../types/review/Review.req.type";
import type { ReviewResponse, PagedReviewResponse } from "../../types/review/Review.res.type";

export const ReviewService = {
    getAll() {
        return BaseService.get<ApiResponse<PagedReviewResponse>>({
            url: API_PATH.REVIEW.BASE,
        });
    },
    create(payload: CreateReviewRequest) {
        return BaseService.post<ApiResponse<ReviewResponse>>({
            url: API_PATH.REVIEW.BASE,
            payload,
        });
    },
    getById(id: string) {
        return BaseService.get<ApiResponse<ReviewResponse>>({
            url: API_PATH.REVIEW.BY_ID(id),
        });
    },
    update(id: string, payload: UpdateReviewRequest) {
        return BaseService.put<ApiResponse<ReviewResponse>>({
            url: API_PATH.REVIEW.BY_ID(id),
            payload,
        });
    },
    delete(id: string) {
        return BaseService.remove<ApiResponse<void>>({
            url: API_PATH.REVIEW.BY_ID(id),
        });
    },
};