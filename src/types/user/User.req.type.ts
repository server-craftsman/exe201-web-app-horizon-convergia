import { Gender, UserRoleInteger } from "../../app/enums";

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
    gender: Gender,
    dob: Date,
    role?: UserRoleInteger,
    shopName?: string,
    shopDescription?: string,
    businessType?: string,
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
}
