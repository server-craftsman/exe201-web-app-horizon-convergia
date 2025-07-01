import { UserSerice } from "@services/user/user.service.ts";
import type { UserSearchAllParams } from "@services/user/user.service.ts";
import { useMutation } from "@tanstack/react-query";

// @ts-ignore
import type { RegisterRequest } from "@types/user/User.req.type";
// @ts-ignore
import type { UserInfo } from "@types/user/User.res.type";
// @ts-ignore
import type { UserSearchParams } from '../../types/user/User.res.type';
import { helpers } from "@utils/index.ts";


export const useUser = () => {
    const register = useMutation({
        mutationFn: (params: RegisterRequest) => UserSerice.register(params),
        onSuccess: (response) => {
            if (response.data.isSuccess) {
                helpers.notificationMessage("Đăng ký thành công!", "success");
            } else {
                helpers.notificationMessage(response.data.message || "Đăng ký thất bại!", "error");
            }
        },
        onError: (error) => {
            console.error('Registration error:', error);
            helpers.notificationMessage("Đăng ký thất bại!", "error");
        }
    });

    const searchUsers = useMutation({
        mutationFn: (params: UserSearchAllParams) => UserSerice.searchUsers(params),
        onError: (error) => {
            console.error('Error searching users:', error);
            helpers.notificationMessage("Lỗi khi tìm kiếm người dùng", "error");
        }
    });

    return {
        register,
        searchUsers
    };
}