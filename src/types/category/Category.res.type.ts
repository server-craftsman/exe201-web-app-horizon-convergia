export interface ICategory {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted?: boolean;
}