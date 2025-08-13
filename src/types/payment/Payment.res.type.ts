export interface PaymentResponse {
    id: string;
    orderIds?: string[];
    orderNumbers?: string[];
    amount?: number;
    method?: string;
    description?: string;
    status?: string;
    paymentUrl?: string;
    redirectUrl?: string;
    createdAt?: string;
}

export interface PendingPayoutResponse {
    id: string;
    fullName?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    reference?: string;
    amount?: number;
    createdAt?: string;
}

export interface PagedPendingPayouts {
    items: PendingPayoutResponse[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}
