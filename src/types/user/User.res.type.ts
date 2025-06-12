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
    phoneNumber: string | null;
    address: string | null;
    gender: string | null;
    avatarUrl: string | null;
    status: string | null;
    role: UserRole | null;
    dob: string | null;
}
