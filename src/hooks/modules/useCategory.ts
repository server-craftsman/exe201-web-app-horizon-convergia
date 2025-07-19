// FILEPATH: D:/CN8/EXE201/web-app-horizon-convergia/src/hooks/modules/useCategory.ts

import { CategoryService } from "@services/category/category.service.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// @ts-ignore
import type { CreateCategory, GetCategoriesParams } from "@types/category/Category.req.type";
// @ts-ignore
import type { ICategory } from "@types/category/Category.res.type";
import { helpers } from "@utils/index";

export const useCategory = () => {
    const queryClient = useQueryClient();

    // CORRECT: Use useQuery for fetching data.
    const useGetAllCategories = (params?: GetCategoriesParams) => {
        return useQuery({
            queryKey: ['categories', params],
            queryFn: async () => {
                const response = await CategoryService.getCategories(params);
                // The actual data is in response.data
                return (response.data || []) as ICategory[];
            },
            staleTime: 5 * 60 * 1000, // 5 minutes
            enabled: true, // Keep it enabled to fetch on mount
        });
    };

    // Keep getCategorys mutation for cases where you need to trigger manually,
    // but for fetching lists, useGetAllCategories is preferred.
    const getCategorys = useMutation({
        mutationFn: (params?: GetCategoriesParams) => CategoryService.getCategories(params),
        onSuccess: (data) => {
            // Manually set the query data for the corresponding query key
            queryClient.setQueryData(['categories'], data.data);
        },
        onError: (error: any) => {
            console.error('Get categories error:', error);
        }
    });

    const getCategory = useMutation({
        mutationFn: (id: string) => CategoryService.getCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            console.error('Get category error:', error);
        }
    });

    const createCategory = useMutation({
        mutationFn: (params: CreateCategory) => CategoryService.createCategory(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            helpers.notificationMessage("Tạo danh mục thành công", "success");
        },
        onError: (error: any) => {
            console.error('Create category error:', error);
            helpers.notificationMessage("Tạo danh mục thất bại", "error");
        }
    });

    const deleteCategory = useMutation({
        mutationFn: (id: string) => CategoryService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            helpers.notificationMessage("Xóa danh mục thành công", "success");
        },
        onError: (error: any) => {
            console.error('Delete category error:', error);
            helpers.notificationMessage("Xóa danh mục thất bại", "error");
        }
    });

    const updateCategory = useMutation({
        mutationFn: ({ id, params }: { id: string; params: CreateCategory }) => CategoryService.updateCategory(id, params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            helpers.notificationMessage("Cập nhật danh mục thành công", "success");
        },
        onError: (error: any) => {
            console.error('Update category error:', error);
            helpers.notificationMessage("Cập nhật danh mục thất bại", "error");
        }
    });

    // Updated getCategoriesByName to use backend filtering with pagination support
    const getCategoriesByName = useMutation({
        mutationFn: async (params: GetCategoriesParams) => {
            const res = await CategoryService.getCategories(params);
            return Array.isArray(res) ? res : (res?.data || []);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            console.error('Get categories by name error:', error);
        }
    });

    return {
        useGetCategories: useGetAllCategories,
        useGetAllCategories,
        getCategorys,
        getCategory,
        createCategory,
        updateCategory,
        deleteCategory,
        getCategoriesByName,
    };
};