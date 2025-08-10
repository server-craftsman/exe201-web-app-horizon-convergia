export interface NewsResponse {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    isDeleted: boolean;
    authorId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
}

export interface NewsSearchResponse {
    data: NewsResponse[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
}

export interface NewsInfo {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    isDeleted: boolean;
    authorId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    author?: {
        id: string;
        name: string;
        email: string;
    };
    category?: {
        id: string;
        name: string;
    };
}
