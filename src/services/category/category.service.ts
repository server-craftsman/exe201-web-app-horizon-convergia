import { BaseService } from "@app/api/base.service.ts";
import type { ApiResponse } from "@app/interface/apiResponse.interface.ts";
// @ts-ignore
import type { CreateCategory, GetCategoriesParams } from "@types/category/Category.req.type";
// @ts-ignore
import type { CategoryResponse } from "@types/category/Category.res.type";
import { API_PATH } from "@consts/api.path.const";


export const CategoryService = {
    createCategory(params: CreateCategory) {
        return BaseService.post<ApiResponse<CategoryResponse>>({
            url: API_PATH.CATEGORY.CREATE,
            payload: params
        });
    },

    getSubCategories(parentId: string) {
        return BaseService.get<ApiResponse<CategoryResponse[]>>({
            url: API_PATH.CATEGORY.GET_SUB_CATEGORIES(parentId)
        });
    },

    getCategories(params?: GetCategoriesParams) {
        let url = API_PATH.CATEGORY.GET_ALL;
        const searchParams = new URLSearchParams();

        if (params?.name) {
            searchParams.append('name', params.name);
        }
        if (params?.pageNumber !== undefined) {
            searchParams.append('pageNumber', params.pageNumber.toString());
        }
        if (params?.pageSize !== undefined) {
            searchParams.append('pageSize', params.pageSize.toString());
        }

        if (searchParams.toString()) {
            url += `?${searchParams.toString()}`;
        }

        return BaseService.get<CategoryResponse[]>({
            isLoading: false,
            url: url
        });
    },

    getCategory(id: string) {
        return BaseService.get<CategoryResponse>({
            isLoading: false,
            url: API_PATH.CATEGORY.GET_BY_ID(id)
        });
    },

    updateCategory(id: string, params: CreateCategory) {
        return BaseService.put<ApiResponse<CategoryResponse>>({
            url: API_PATH.CATEGORY.UPDATE(id),
            payload: params
        });
    },

    deleteCategory(id: string) {
        return BaseService.remove<ApiResponse<any>>({
            url: API_PATH.CATEGORY.DELETE(id)
        });
    }
};