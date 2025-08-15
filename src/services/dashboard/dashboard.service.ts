import { BaseService } from "../../app/api/base.service";
import type { PromiseState } from "../../app/api/base.service";
import { API_PATH } from "../../consts/api.path.const";
import type { DashboardResponse, DashboardQueryParams } from "../../types";

export const DashboardService = {
    getAdminDashboard: (params?: DashboardQueryParams): Promise<PromiseState<DashboardResponse>> => {
        return BaseService.get<DashboardResponse>({
            url: API_PATH.DASHBOARD.ADMIN,
            payload: params,
            isLoading: true
        });
    }
};
