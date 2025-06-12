import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { AuthService } from "../services/auth/auth.service";
import type { LoginRequest } from "../types/user/User.req.type";
import { helpers } from "../utils";
import { ROUTER_URL } from "../consts/router.path.const";
import { UserRole } from "../app/enums";

export const useAuth = () => {

    const getCurrentRole = (): UserRole | null => {
        return AuthService.getRole();
    };

    const isAuthenticated = (): boolean => {
        return AuthService.isAuthenticated();
    };

    const getCurrentUser = () => {
        return AuthService.getCurrentLoginUser();
    };

    const getDefaultPath = (role: UserRole): string => {
        switch (role) {
            case UserRole.ADMIN:
                return ROUTER_URL.ADMIN.BASE;
            default:
                return ROUTER_URL.COMMON.HOME;
        }
    };

    return {
        getCurrentRole,
        isAuthenticated,
        getCurrentUser,
        getDefaultPath
    };
};

export const useLogin = () => {
    const { setItem } = useLocalStorage();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            // Defensive: ensure data is not empty
            if (!data.email || !data.password) {
                throw new Error('Email and password are required');
            }
            // Optionally trim
            return AuthService.login({
                email: data.email.trim(),
                password: data.password.trim(),
            });
        },
        onSuccess: (response) => {
            if (!response?.data) {
                throw new Error('Invalid response format');
            }

            const userData = response.data;

            // Store user data and token
            setItem("user", JSON.stringify(userData));
            setItem("accessToken", userData.accessToken || '');
            setItem("role", userData.role);

            helpers.notificationMessage("Đăng nhập thành công!", "success");

            // Redirect based on role
            switch (userData.role) {
                case UserRole.ADMIN:
                    navigate(ROUTER_URL.ADMIN.BASE);
                    break;
                default:
                    navigate(ROUTER_URL.COMMON.HOME);
            }
        },
        onError: (error: any) => {
            console.error('Login error:', error);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.entries(errors).forEach(([messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach(message => {
                            helpers.notificationMessage(message, "error");
                        });
                    }
                });
            } else if (error.message) {
                helpers.notificationMessage(error.message, "error");
            } else {
                helpers.notificationMessage("Đăng nhập thất bại", "error");
            }
        },
    });
};

export const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        AuthService.logout();
        navigate(ROUTER_URL.COMMON.HOME);
        helpers.notificationMessage("Đăng xuất thành công!", "success");
    };

    return { logout };
};