import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalstorage";
import { AuthService } from "../services/auth/auth.service.ts";
import type { UserInfo } from "../types/user/User.res.type";

export function useUserInfo() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const { getItem, setItem } = useLocalStorage();

    useEffect(() => {
        // Try to get user from localStorage first
        const storedUser = getItem("userInfo");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user info");
            }
        }

        // Check if we have a token before trying to fetch user data
        const token = localStorage.getItem("accessToken");
        if (token && AuthService.isAuthenticated()) {
            AuthService.getCurrentUser()
                .then((response) => {
                    if (response && response.data) {
                        setItem("userInfo", JSON.stringify(response.data));
                        setUser(response.data);
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch user information:", error);
                    // If we get a 401, clear the token as it's invalid
                    if (error?.response?.status === 401) {
                        AuthService.logout();
                    }
                });
        }
    }, []);

    return user;
}