import { BaseService } from "@app/api/base.service";
import { API_PATH } from "@consts/api.path.const";
import type { ApiResponse } from "@app/interface/apiResponse.interface";
import type { MultiPaymentRequest, PayOsCallbackQuery, GetPendingPayoutsQuery, ApprovePayoutRequest } from "../../types/payment/Payment.req.type";
import type { PaymentResponse, PagedPendingPayouts } from "../../types/payment/Payment.res.type";

export const PaymentService = {
    // POST /Payments/multi-payment
    multiPayment(payload: MultiPaymentRequest) {
        return BaseService.post<ApiResponse<PaymentResponse>>({
            url: API_PATH.PAYMENT.MULTI_PAYMENT,
            payload,
        });
    },

    // GET /Payments/payos-callback
    payOsCallback(query: PayOsCallbackQuery) {
        return BaseService.get<ApiResponse<void>>({
            url: API_PATH.PAYMENT.PAYOS_CALLBACK,
            payload: query as any,
        });
    },

    // GET /Payments/GetPendingPayouts
    getPendingPayouts(query: GetPendingPayoutsQuery) {
        return BaseService.get<ApiResponse<PagedPendingPayouts>>({
            url: API_PATH.PAYMENT.GET_PENDING_PAYOUTS,
            payload: query as any,
        });
    },

    // POST /Payments/ApprovePayOut
    approvePayout(payload: ApprovePayoutRequest) {
        return BaseService.post<ApiResponse<void>>({
            url: API_PATH.PAYMENT.APPROVE_PAYOUT,
            payload,
        });
    },
};
