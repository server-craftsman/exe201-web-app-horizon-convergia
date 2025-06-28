import { BaseService } from "@app/api/base.service.ts";
import type { ApiResponse } from "../../app/interface/apiResponse.interface";
import type { LoginRequest, ResetPasswordRequest } from "../../types/user/User.req.type";
import type { UserResponse, UserInfo } from "../../types/user/User.res.type";
import { API_PATH } from "../../consts/api.path.const";
import { UserRole } from "@app/enums";

export const AuthService = {
    login(params: LoginRequest) {
        const query = new URLSearchParams({
            email: params.email,
            password: params.password,
        }).toString();

        return BaseService.post<ApiResponse<UserResponse>>({
            url: `${API_PATH.AUTH.LOGIN}?${query}`,
        });
    },

    getCurrentLoginUser() {
        return BaseService.get<UserInfo>({
            url: API_PATH.AUTH.CURRENT_USER,
        });
    },

    logout() {
        return BaseService.post<ApiResponse<any>>({
            url: API_PATH.AUTH.LOGOUT,
        });
        // localStorage.removeItem("user");
        // localStorage.removeItem("role");
        // localStorage.removeItem("userId");
        // localStorage.removeItem("accessToken");
    },

    getAccessToken(): string | null {
        return localStorage.getItem("accessToken");
    },

    getRole(): UserRole | null {
        const role = localStorage.getItem("role");
        return role as UserRole || null;
    },

    isAuthenticated(): boolean {
        const hasToken = !!this.getAccessToken();
        const hasRole = !!this.getRole();
        return hasToken && hasRole;
    },

    updateUserInfo(user: UserInfo) {
        return BaseService.put<UserInfo>({
            url: API_PATH.USER.UPDATE_USER_PROFILE.replace(":id", user.id?.toString() || ""),
            payload: user
        })
    },
    async uploadAvatar(file: File): Promise<string | null> {
        return await BaseService.uploadFile(file, "image");
    },

    verifyEmail(token: string) {
        const url = API_PATH.AUTH.VERIFY_EMAIL;
        return BaseService.get<ApiResponse<any>>({
            url: `${url}?token=${encodeURIComponent(token)}`,
        });
    },

    forgotPassword(email: string) {
        const url = API_PATH.AUTH.FORGOT_PASSWORD;
        return BaseService.post<ApiResponse<any>>({
            url,
            payload: { email }
        });
    },

    resetPassword({ token, newPassword }: ResetPasswordRequest) {
        const url = API_PATH.AUTH.RESET_PASSWORD;
        return BaseService.post<ApiResponse<any>>({
            url: `${url}?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`,
        });
    },

    changePassword(newPassword: string, id: string) {
        const url = API_PATH.AUTH.CHANGE_PASSWORD(id);
        return BaseService.put<ApiResponse<any>>({
            url,
            payload: { newPassword }
        });
    },

    loginViaGoogle() {
        const url = API_PATH.AUTH.GOOGLE_LOGIN;
        return BaseService.get<ApiResponse<any>>({
            url,
        });
    },

    googleCallback() {
        const url = API_PATH.AUTH.GOOGLE_CALLBACK;
        return BaseService.get<ApiResponse<any>>({
            url,
        });
    }
}