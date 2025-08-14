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
    async delete(id: string) {
        const url = API_PATH.REVIEW.BY_ID(id);
        try {
            return await BaseService.remove<ApiResponse<void>>({ url });
        } catch (e: any) {
            const status = e?.response?.status as number | undefined;
            const msg = e?.message || '';
            if (status === 405 || status === 415 || /Method Not Allowed|Unsupported Media Type/i.test(msg)) {
                // Fallback: some backends expect PUT to "delete"
                return BaseService.put<ApiResponse<void>>({ url });
            }
            throw e;
        }
    },
};