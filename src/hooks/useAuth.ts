import { useState, useEffect } from 'react';
import { UserRoleInteger } from '../app/enums';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRoleInteger;
    avatar?: string;
    isActive: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        token: null
    });

    useEffect(() => {
        // Check if user is already logged in (from localStorage or token)
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const userInfo = localStorage.getItem('userInfo');

                if (token && userInfo) {
                    const user = JSON.parse(userInfo);
                    setAuthState({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        token
                    });
                } else {
                    setAuthState(prev => ({
                        ...prev,
                        isLoading: false
                    }));
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setAuthState(prev => ({
                    ...prev,
                    isLoading: false
                }));
            }
        };

        initializeAuth();
    }, []);

    const login = (user: User, token: string) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userInfo', JSON.stringify(user));
        setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            token
        });
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            token: null
        });
    };

    const updateUser = (updatedUser: Partial<User>) => {
        if (authState.user) {
            const newUser = { ...authState.user, ...updatedUser };
            localStorage.setItem('userInfo', JSON.stringify(newUser));
            setAuthState(prev => ({
                ...prev,
                user: newUser
            }));
        }
    };

    const hasRole = (requiredRoles: UserRoleInteger[]): boolean => {
        return authState.user ? requiredRoles.includes(authState.user.role) : false;
    };

    const isBuyer = (): boolean => authState.user?.role === UserRoleInteger.BUYER;
    const isSeller = (): boolean => authState.user?.role === UserRoleInteger.SELLER;
    const isShipper = (): boolean => authState.user?.role === UserRoleInteger.SHIPPER;
    const isAdmin = (): boolean => authState.user?.role === UserRoleInteger.ADMIN;

    return {
        ...authState,
        login,
        logout,
        updateUser,
        hasRole,
        isBuyer,
        isSeller,
        isShipper,
        isAdmin
    };
}; 