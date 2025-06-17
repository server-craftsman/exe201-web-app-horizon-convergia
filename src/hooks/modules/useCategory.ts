// FILEPATH: D:/CN8/EXE201/web-app-horizon-convergia/src/hooks/modules/useCategory.ts

import { CategoryService } from "@services/category/category.service.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// @ts-ignore
import type { CreateCategory } from "@types/category/Category.req.type";
// @ts-ignore
import type {ICategory} from "@types/category/Category.res.type";
import {helpers} from "@utils/index";

export const useCategory = () => {
    const queryClient = useQueryClient();

    const getCategorys = useMutation({
        mutationFn: () => CategoryService.getCategories(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            console.error('Get categories error:', error);
        }
    })

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

    return {
        getCategorys,
        getCategory,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};