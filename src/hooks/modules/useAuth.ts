import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../other/useLocalStorage.ts";
import { AuthService } from "@services/auth/auth.service.ts";
// @ts-ignore
import type { LoginRequest, ResetPasswordRequest } from "@types/user/User.req.type";
import { helpers } from "@utils/index.ts";
import { ROUTER_URL } from "@consts/router.path.const.ts";
import { UserRole } from "@app/enums";

export const useAuth = () => {
    const { getItem, clearStorage } = useLocalStorage();

    const getCurrentRole = (): UserRole | null => {
        const role = getItem("role");
        return role as UserRole || null;
    };

    const isAuthenticated = (): boolean => {
        const hasToken = !!getItem("accessToken");
        const hasRole = !!getCurrentRole();
        return hasToken && hasRole;
    };

    const getCurrentUser = () => {
        return AuthService.getCurrentLoginUser();
    };

    const getDefaultPath = (role: UserRole): string => {
        if (!role) {
            return ROUTER_URL.COMMON.HOME;
        }
        switch (role) {
            case UserRole.ADMIN:
                return ROUTER_URL.ADMIN.BASE;
            default:
                return ROUTER_URL.COMMON.HOME;
        }
    };

    const verifyEmail = useMutation({
        mutationFn: AuthService.verifyEmail,
        onSuccess: (response) => {
            helpers.notificationMessage(response.data.data, "success");
        },
        onError: (error: any) => {
            console.error('Verify email error:', error);
        }
    });

    const forgotPassword = useMutation({
        mutationFn: AuthService.forgotPassword,
        onSuccess: (response) => {
            helpers.notificationMessage(response.data.data, "success");
        },
        onError: (error: any) => {
            console.error('Forgot password error:', error);
        }
    });


    const resetPassword = useMutation({
        mutationFn: async (data: ResetPasswordRequest) => {
            if (!data.token || !data.newPassword) {
                throw new Error('Token and password are required');
            }
            return AuthService.resetPassword({ token: data.token, newPassword: data.newPassword });
        },
        onSuccess: (response) => {
            helpers.notificationMessage(response.data.data, "success");
        },
        onError: (error: any) => {
            console.error('Reset password error:', error);
        }
    });

    const changePassword = useMutation({
        mutationFn: async ({ newPassword, id }: { newPassword: string, id: string | null }) => {
            if (!id) {
                throw new Error('User ID is required');
            }
            return AuthService.changePassword(newPassword, id.toString()) as Promise<any>;
        },
        onSuccess: (response) => {
            helpers.notificationMessage(response.data.data, "success");
        },
        onError: (error: any) => {
            console.error('Change password error:', error);
        }
    });

    const logout = useMutation({
        mutationFn: AuthService.logout,
        onSuccess: () => {
            helpers.notificationMessage("Đăng xuất thành công!", "success");
            clearStorage();
            window.location.href = ROUTER_URL.AUTH.LOGIN;
        },
        onError: (error: any) => {
            console.error('Logout error:', error);
        }
    });


    return {
        getCurrentRole,
        isAuthenticated,
        getCurrentUser,
        getDefaultPath,
        verifyEmail,
        forgotPassword,
        resetPassword,
        changePassword,
        logout,
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
            setItem("accessToken", userData.data.accessToken || '');
            setItem("role", userData.data.role);

            // Fetch user info with direct API call, not using hooks
            try {
                const userInfoResponse = await AuthService.getCurrentLoginUser();
                if (userInfoResponse && userInfoResponse.data) {
                    setItem("userInfo", JSON.stringify(userInfoResponse.data));

                    // Only navigate after all data is set
                    helpers.notificationMessage("Đăng nhập thành công!", "success");

                    // Navigate based on role
                    switch (userData.data.role) {
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
