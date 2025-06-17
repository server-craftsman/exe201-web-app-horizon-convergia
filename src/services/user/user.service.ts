import {BaseService} from "../../app/api/base.service.ts";
import type {ApiResponse} from "../../app/interface/apiResponse.interface.ts";
import type {RegisterRequest} from "../../types/user/User.req.type.ts";
import type {UserInfo} from "../../types/user/User.res.type.ts";
import {API_PATH} from "../../consts/api.path.const.ts";

export const UserSerice = {
    register(params: RegisterRequest)  {
        return BaseService.post<ApiResponse<UserInfo>>({
            url: API_PATH.AUTH.REGISTER,
            payload: params
        });
    }
}