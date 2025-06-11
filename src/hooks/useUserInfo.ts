import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalstorage";
import { jwtDecode } from "jwt-decode";

export interface UserInfo {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dob?: string;
    gender?: string;
    phoneNumber?: string;
    profilePicUrl?: string | null;
    token?: string;
}

export function useUserInfo(): UserInfo | null {
    const { getItem } = useLocalStorage();
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        try {
            const userStr = getItem("user");
            if (userStr) {
                const userObj = JSON.parse(userStr);
                if (userObj && userObj.accessToken) {
                    const decoded: any = jwtDecode(userObj.accessToken);
                    setUser({
                        id: decoded.id || decoded.sub || "",
                        email: decoded.email || "",
                        firstName: decoded.firstName || "",
                        lastName: decoded.lastName || "",
                        dob: decoded.dob,
                        gender: decoded.gender,
                        phoneNumber: decoded.phoneNumber,
                        profilePicUrl: decoded.profilePicUrl,
                        token: userObj.accessToken,
                    });
                    console.log("user: ", user);
                    return;
                }
                setUser(null);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        }
    }, []);

    return user;
}