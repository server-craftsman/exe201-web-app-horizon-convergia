import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import type { DashboardResponse, DashboardQueryParams } from '../../types';

export const useDashboard = (params?: DashboardQueryParams): UseQueryResult<DashboardResponse, Error> => {
    return useQuery({
        queryKey: ['admin-dashboard', params],
        queryFn: async () => {
            try {
                console.log('Fetching dashboard with params:', params);
                const response = await DashboardService.getAdminDashboard(params);
                console.log('Dashboard response:', response);
                return response.data;
            } catch (error) {
                console.error('Dashboard fetch error:', error);
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            console.log('Retry attempt:', failureCount, 'Error:', error);
            return failureCount < 2; // Only retry twice
        }
    });
};
