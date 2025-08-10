export interface CreateNewsRequest {
    title: string;
    content: string;
    imageUrl: string;
    categoryId: string;
}

export interface BlogCreateItem {
    title: string;
    content: string;
    imageUrl: string;
}

export interface CreateNewsBlogRequest {
    blogDto: BlogCreateItem[];
    CategoryId: string;
}

export interface UpdateNewsRequest {
    title?: string;
    content?: string;
    imageUrl?: string;
    categoryId?: string;
}

export interface NewsSearchAllParams {
    keyword?: string;
    categoryId?: string;
    authorId?: string;
    isDeleted?: boolean;
    pageIndex?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
