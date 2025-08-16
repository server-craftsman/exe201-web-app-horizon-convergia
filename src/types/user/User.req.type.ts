import { UserRoleInteger } from "../../app/enums";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    address: string,
    gender: number,
    dob: Date,
    role?: UserRoleInteger,
    shopName?: string,
    shopDescription?: string,
    businessType?: string,
    bankName?: string,
    bankAccountNumber?: string,
    bankAccountHolder?: string
}

export interface ResetPasswordRequest {
    newPassword: string;
    token: string;
}

export interface UpdateUserRequest {
    id: string,
    name: string,
    email: string,
    phoneNumber: string,
    address: string,
    avatarUrl: string,
    dob: Date,
    gender?: number,
    shopName?: string,
    shopDescription?: string,
    businessType?: string,
    bankName?: string,
    bankAccountNumber?: string,
    bankAccountHolder?: string
}

export type UserSearchAllParams = Partial<import('./User.res.type').UserSearchParams> & {
    pageIndex: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: string;
    role?: number;
    status?: number;
    keyword?: string;
};
