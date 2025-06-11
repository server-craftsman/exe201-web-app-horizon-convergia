import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalstorage";
import { jwtDecode } from "jwt-decode";

export interface UserInfo {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dob?: string;
    role?: string;
    gender?: string;
    phoneNumber?: string;
    profilePicUrl?: string | null;
    token?: string;
}

export function useUserInfo() {
    const { getItem } = useLocalStorage();
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        try {
            const userStr = getItem("accessToken");
            if (userStr) {
                const decoded: any = jwtDecode(userStr);
                const userObj: UserInfo = {
                    id: decoded.UserId || "",
                    email: decoded.Email || "",
                    role: decoded.Role || "",
                    firstName: decoded.UserName || "",
                    lastName: "",
                    dob: decoded.Dob,
                    gender: decoded.Gender,
                    phoneNumber: decoded.PhoneNumber,
                    profilePicUrl: decoded.ProfilePicUrl,
                    token: userStr,
                };
                setUser(userObj);
                console.log("user: ", userObj);
                return;
            }
            setUser(null);
        } catch {
            setUser(null);
        }
    }, []);

    return user;
}