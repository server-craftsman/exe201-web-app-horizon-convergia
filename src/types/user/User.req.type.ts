import { Gender, UserRoleInteger } from "../../app/enums";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string | null,
    email: string,
    password: string,
    phoneNumber: number | undefined,
    address: string | undefined,
    gender: Gender,
    dob: Date | undefined,
    role?: UserRoleInteger,
    shopName?: string,
    shopDescription?: string,
    businessType?: string,

}

export interface ResetPasswordRequest {
    newPassword: string;
    token: string;
}