export interface ICategory {
    id: string;
    name: string;
    imageUrl: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted?: boolean;
}