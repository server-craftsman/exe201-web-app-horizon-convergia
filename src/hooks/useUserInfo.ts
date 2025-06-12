import { useEffect, useState } from "react";
import { AuthService } from "../services/auth/auth.service";
import type { UserInfo } from "../types/user/User.res.type";
import { useLocalStorage } from "./useLocalStorage";

/**
 * useUserInfo hook
 * 
 * Fixes infinite refresh by:
 * - Only fetching user info if accessToken exists in localStorage.
 * - Avoids triggering global error handlers that may redirect on 401.
 */
export function useUserInfo() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const { getItem, setItem } = useLocalStorage();
    useEffect(() => {
        // Only fetch user info if accessToken exists
        const accessToken = getItem("accessToken");
        if (!accessToken) {
            setUser(null);
            return;
        }

        let isMounted = true;

        const fetchUser = async () => {
            try {
                const currentUser = await AuthService.getCurrentLoginUser();
                if (isMounted && currentUser && currentUser.data) {
                    const userObj: UserInfo = {
                        id: currentUser.data.id,
                        email: currentUser.data.email,
                        role: currentUser.data.role,
                        name: currentUser.data.name,
                        dob: currentUser.data.dob,
                        gender: currentUser.data.gender,
                        phoneNumber: currentUser.data.phoneNumber,
                        avatarUrl: currentUser.data.avatarUrl,
                        status: currentUser.data.status,
                        address: currentUser.data.address,
                    };
                    setUser(userObj);
                    setItem("userInfo", JSON.stringify(userObj));
                    setItem("role", currentUser.data.role ?? "");
                } else if (isMounted) {
                    setUser(null);
                }
            } catch (err: any) {
                // Prevent infinite refresh: do not trigger global error handler here
                if (isMounted) setUser(null);
            }
        };
        fetchUser();

        return () => {
            isMounted = false;
        };
    }, []);

    return user;
}