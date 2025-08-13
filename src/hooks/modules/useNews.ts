import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NewsService } from '../../services/news/news.service';
import type { CreateNewsRequest, UpdateNewsRequest, NewsSearchAllParams } from '../../types/news/News.req.type';

export const useNews = () => {
    const queryClient = useQueryClient();

    // Get all news
    const getAllNews = useQuery({
        queryKey: ['news', 'all'],
        queryFn: NewsService.getAllNews,
    });

    // Get blog list with filters
    const useBlogList = (params?: { categoryId?: string; pageNumber?: number; pageSize?: number }) => {
        return useQuery({
            queryKey: ['news', 'blogList', params],
            queryFn: () => NewsService.getBlogList(params),
            enabled: true,
        });
    };

    // Search news
    const useSearchNews = (params: NewsSearchAllParams) => {
        return useQuery({
            queryKey: ['news', 'search', params],
            queryFn: () => NewsService.searchNews(params),
            enabled: false, // Manual trigger
        });
    };

    // Get news by ID
    const useGetNewsById = (id: string) => {
        return useQuery({
            queryKey: ['news', 'detail', id],
            queryFn: () => NewsService.getNewsById(id),
            enabled: !!id,
        });
    };

    // Create news mutation
    const createNews = useMutation({
        mutationFn: (data: CreateNewsRequest) => NewsService.createNews(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
        },
    });

    // Update news mutation
    const updateNews = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateNewsRequest }) => 
            NewsService.updateNews(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
        },
    });

    // Delete news mutation
    const deleteNews = useMutation({
        mutationFn: (id: string) => NewsService.deleteNews(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
        },
    });

    return {
        getAllNews,
        useBlogList,
        useSearchNews,
        useGetNewsById,
        createNews,
        updateNews,
        deleteNews,
    };
};
