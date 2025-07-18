export interface ICategory {
    id: string;
    name: string;
    imageUrl: string;
    description?: string;
    parentCategoryId: string | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted?: boolean;
}