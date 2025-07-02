import {BaseService} from "../../app/api/base.service.ts";
import type {ApiResponse} from "../../app/interface/apiResponse.interface.ts";
import type {RegisterRequest} from "../../types/user/User.req.type.ts";
import type {UserInfo, UserSearchResponse} from "../../types/user/User.res.type.ts";
import {API_PATH} from "../../consts/api.path.const.ts";
import type { UserSearchAllParams } from '../../types/user/User.req.type';

export const UserSerice = {
    register(params: RegisterRequest)  {
        return BaseService.post<ApiResponse<UserInfo>>({
            url: API_PATH.AUTH.REGISTER,
            payload: params
        });
    },
    
    searchUsers(params: UserSearchAllParams) {
        const queryParams = new URLSearchParams();
        if (params.keyword !== undefined) queryParams.append('keyword', params.keyword);
        if (params.role !== undefined) queryParams.append('role', params.role.toString());
        if (params.status !== undefined) queryParams.append('status', params.status.toString());
        if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        return BaseService.get<ApiResponse<UserSearchResponse>>({
            url: `${API_PATH.USER.SEARCH_USERS}?${queryParams.toString()}`
        });
    },

    adminCreateUser(params: RegisterRequest) {
        return BaseService.post<ApiResponse<UserInfo>>({
            url: API_PATH.USER.ADMIN_CREATE,
            payload: params
        });
    },

    deleteUser(id: string) {
        return BaseService.remove<ApiResponse<any>>({
            url: API_PATH.USER.DELETE_USER(id)
        });
    },

    getUserById(id: string) {
        return BaseService.get<ApiResponse<UserInfo>>({
            url: API_PATH.USER.GET_USER_BY_ID(id)
        });
    }
}