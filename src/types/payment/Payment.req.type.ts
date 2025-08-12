export interface MultiPaymentRequest {
    orderIds?: string[];
    orderNumbers?: string[];
    paymentMethod: string; // ví dụ: payos, cod, bank-transfer
    description?: string;
}

export interface PayOsCallbackQuery {
    OrderCode?: string;
    Status?: string;
    id?: string;
}

export interface GetPendingPayoutsQuery {
    fullName?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    reference?: string;
    fromDate?: string; // ISO
    toDate?: string; // ISO
    page?: number;
    pageSize?: number;
}

export interface ApprovePayoutRequest {
    paymentId: string;
    approve: boolean;
}
