import type { UserRole } from "../../app/enums";

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    accessToken?: string;
    refreshToken?: string;
    role: UserRole;
    expiredAt?: string;
}

export interface UserInfo {
    id: string;
    name: string | null;
    email: string | null;
    phoneNumber: string | null;
    address: string | null;
    gender: number | null;
    avatarUrl: string | null;
    status: number | null;
    role: UserRole | null;
    dob: string | null;
    createdAt?: string;
    updatedAt?: string;
    shopName?: string;
    shopDescription?: string;
    businessType?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountHolder?: string;
    isVerified?: boolean;
}

export interface UserSearchItem {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string | null;
    status: number;
    role: number;
    address?: string;
    dob?: string;
    isDeleted?: boolean;
}

export interface UserSearchResponse {
    items: UserSearchItem[];
    totalRecords: number;
    pageIndex: number;
    pageSize: number;
}

export interface UserSearchParams {
    keyword?: string; // Optional nhưng sẽ được set thành "all" nếu không có giá trị
    pageIndex?: number;
    pageSize?: number;
}
