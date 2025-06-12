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
            if (!data.email || !data.password) {
                throw new Error('Email and password are required');
            }
            return AuthService.login({
                email: data.email.trim(),
                password: data.password.trim(),
            });
        },
        onSuccess: async (response) => {
            if (!response?.data) {
                throw new Error('Invalid response format');
            }

            const userData = response.data;

            // Store token and role directly from login response
            setItem("accessToken", userData.accessToken || '');
            setItem("role", userData.role);

            // Fetch user info with direct API call, not using hooks
            try {
                const userInfoResponse = await AuthService.getCurrentLoginUser();
                if (userInfoResponse && userInfoResponse.data) {
                    setItem("userInfo", JSON.stringify(userInfoResponse.data));

                    // Only navigate after all data is set
                    helpers.notificationMessage("Đăng nhập thành công!", "success");

                    // Navigate based on role
                    switch (userData.role) {
                        case UserRole.ADMIN:
                            navigate(ROUTER_URL.ADMIN.BASE);
                            break;
                        default:
                            navigate(ROUTER_URL.COMMON.HOME);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user info after login:", error);
                // Clear auth data on error
                AuthService.logout();
                helpers.notificationMessage("Failed to fetch user info", "error");
            }
        },
        onError: (error: any) => {
            console.error('Login error:', error);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.entries(errors).forEach(([_, messages]) => {
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
    const { removeItem } = useLocalStorage();

    const logout = () => {
        // Clear all auth-related items
        removeItem("accessToken");
        removeItem("userInfo");
        removeItem("role");

        // Call service logout if needed
        AuthService.logout();

        // Navigate to home
        navigate(ROUTER_URL.AUTH.LOGIN);
        helpers.notificationMessage("Đăng xuất thành công!", "success");
    };

    return { logout };
};