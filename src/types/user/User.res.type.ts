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
    email: string;
    role: UserRole | ''; // UserRole
    name: string;
    dob: string | null;
    gender: string;
    phoneNumber: string | null;
    profilePicUrl: string | null;
    token: string;
}