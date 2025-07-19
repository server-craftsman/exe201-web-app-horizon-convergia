export interface CreateCategory {
    name: string;
    imageUrl: string;
    parentCategoryId: string | null;
}

export interface GetCategoriesParams {
    name?: string;
    pageNumber?: number;
    pageSize?: number;
}
