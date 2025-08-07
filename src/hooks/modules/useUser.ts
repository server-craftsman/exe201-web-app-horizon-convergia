import { UserSerice } from "@services/user/user.service.ts";
import type { UserSearchAllParams } from '../../types/user/User.req.type';
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import type { RegisterRequest } from "@types/user/User.req.type";
// @ts-ignore
import type { UserInfo } from "@types/user/User.res.type";
// @ts-ignore
import type { UserSearchParams } from '../../types/user/User.res.type';
import { helpers } from "@utils/index.ts";
import { ROUTER_URL } from "@consts/router.path.const";


export const useUser = () => {
    const navigate = useNavigate();
    const register = useMutation({
        mutationFn: (params: RegisterRequest) => UserSerice.register(params),
        onSuccess: (response) => {
            if (response.data.isSuccess) {
                helpers.notificationMessage("Đăng ký thành công!", "success");
                setTimeout(() => {
                    navigate(ROUTER_URL.AUTH.LOGIN);
                }, 2000);
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