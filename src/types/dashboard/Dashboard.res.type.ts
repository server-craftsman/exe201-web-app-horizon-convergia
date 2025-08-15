export interface DashboardTransaction {
    id: string;
    reference: string;
    amount: number;
    transactionDate: string;
    paymentMethod: string;
    paymentStatus: "Completed" | "Pending" | "Failed";
}

export interface DashboardResponse {
    totalRevenue: number;
    totalProducts: number;
    totalOrders: number;
    transactions: DashboardTransaction[];
}

export interface DashboardQueryParams {
    startDate?: string;
    endDate?: string;
}
