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

