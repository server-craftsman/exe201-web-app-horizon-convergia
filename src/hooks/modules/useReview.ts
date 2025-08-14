import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReviewService } from '@services/review/review.service';
import type { CreateReviewRequest, UpdateReviewRequest } from '../../types/review/Review.req.type';
import type { ReviewResponse } from '../../types/review/Review.res.type';

export const useReview = () => {
    const queryClient = useQueryClient();

    const useProductReviews = (productId?: string) => {
        return useQuery<{ items: ReviewResponse[] }>({
            queryKey: ['reviews', 'product', productId],
            enabled: !!productId,
            queryFn: async () => {
                const resp = await ReviewService.getAll();
                const raw = (resp as any)?.data;
                const payload = raw?.data || raw;
                const items = payload?.items || payload || [];
                return { items: (items as ReviewResponse[]).filter(r => r.productId === productId) };
            },
            staleTime: 30 * 1000,
        });
    };

    const createReview = useMutation({
        mutationFn: async (payload: CreateReviewRequest) => {
            const resp = await ReviewService.create(payload);
            return (resp as any)?.data?.data || (resp as any)?.data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', 'product', variables.productId] });
        },
    });

    const updateReview = useMutation({
        mutationFn: async (args: { id: string; payload: UpdateReviewRequest }) => {
            const resp = await ReviewService.update(args.id, args.payload);
            return (resp as any)?.data?.data || (resp as any)?.data;
        },
        onSuccess: (_data, variables) => {
            const productId = (variables as any)?.payload?.productId;
            if (productId) queryClient.invalidateQueries({ queryKey: ['reviews', 'product', productId] });
        },
    });

    const deleteReview = useMutation({
        mutationFn: async (args: { id: string; productId: string }) => {
            const resp = await ReviewService.delete(args.id);
            return (resp as any)?.data?.data || (resp as any)?.data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', 'product', variables.productId] });
        },
    });

    return { useProductReviews, createReview, updateReview, deleteReview };
};
