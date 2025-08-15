import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import type { DashboardResponse, DashboardQueryParams } from '../../types';

export const useDashboard = (params?: DashboardQueryParams): UseQueryResult<DashboardResponse, Error> => {
    return useQuery({
        queryKey: ['admin-dashboard', params],
        queryFn: async () => {
            const response = await DashboardService.getAdminDashboard(params);
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
};
