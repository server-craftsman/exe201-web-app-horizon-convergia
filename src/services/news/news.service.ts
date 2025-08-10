import { BaseService } from "../../app/api/base.service";
import type { ApiResponse } from "../../app/interface/apiResponse.interface";
import type { CreateNewsRequest, UpdateNewsRequest, NewsSearchAllParams } from "../../types/news/News.req.type";
import type { NewsResponse, NewsSearchResponse, NewsInfo } from "../../types/news/News.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const NewsService = {
    // Get all news
    getAllNews() {
        return BaseService.get<NewsResponse[]>({
            url: API_PATH.NEWS.GET_ALL
        });
    },

    // Search news with parameters
    searchNews(params: NewsSearchAllParams) {
        const queryParams = new URLSearchParams();
        if (params.keyword !== undefined) queryParams.append('keyword', params.keyword);
        if (params.categoryId !== undefined) queryParams.append('categoryId', params.categoryId);
        if (params.authorId !== undefined) queryParams.append('authorId', params.authorId);
        if (params.isDeleted !== undefined) queryParams.append('isDeleted', params.isDeleted.toString());
        if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        
        return BaseService.get<ApiResponse<NewsSearchResponse>>({
            url: `${API_PATH.NEWS.SEARCH}?${queryParams.toString()}`
        });
    },

    // Create news
    createNews(params: CreateNewsRequest) {
        const { categoryId, ...blogData } = params;
        return BaseService.post<ApiResponse<NewsInfo>>({
            url: API_PATH.NEWS.CREATE,
            payload: {
                Blogs: [blogData],  // Changed from blogDto to Blogs
                CategoryId: categoryId
            }
        });
    },

    // Get news by ID
    getNewsById(id: string) {
        return BaseService.get<ApiResponse<NewsInfo>>({
            url: API_PATH.NEWS.GET_BY_ID(id)
        });
    },

    // Update news
    updateNews(id: string, data: UpdateNewsRequest) {
        return BaseService.put<ApiResponse<NewsInfo>>({
            url: API_PATH.NEWS.UPDATE(id),
            payload: data
        });
    },

    // Delete news
    deleteNews(id: string) {
        return BaseService.remove<ApiResponse<any>>({
            url: API_PATH.NEWS.DELETE(id)
        });
    }
};
