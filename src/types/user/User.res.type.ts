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
    id: number | null;
    name: string | null;
    email: string | null;
    phoneNumber: number | null;
    address: string | null;
    gender: string | null;
    avatarUrl: string | null;
    status: string | null;
    role: UserRole | null;
    dob: string | null;
}

export interface UserSearchItem {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string | null;
    status: number;
    role: number;
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
