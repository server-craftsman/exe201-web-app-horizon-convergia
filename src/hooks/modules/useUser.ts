import {UserSerice} from "@services/user/user.service.ts";
import { useMutation} from "@tanstack/react-query";

// @ts-ignore
import type {RegisterRequest} from "@types/user/User.req.type.ts";
// import type {UserInfo} from "@types/user/User.res.type";
import {helpers} from "@utils/index.ts";

export const useUser = () => {
    const register = useMutation({
        mutationFn: async (data: RegisterRequest)=> {
            if (!data.name || !data.email || !data.password) {
                throw new Error('Name, email, and password are required');
            }
            return UserSerice.register({
                name: data.name.trim(),
                email: data.email.trim(),
                password: data.password.trim(),
                phoneNumber: data.phoneNumber,
                address: data.address?.trim(),
                gender: data.gender,
                dob: data.dob,
            });
        },
        onSuccess: () => {
            helpers.notificationMessage("Đăng ký thành công!", "success");
        },
        onError: (error: any) => {
            // Handle registration error, e.g., show an error message
            helpers.notificationMessage("Đăng ký thất bại! Vui lòng thử lại.", "error");
            console.error('Registration error:', error);
        }
    });

    return {
        register,
    };
}