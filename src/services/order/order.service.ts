import { BaseService } from "@app/api/base.service";
import { API_PATH } from "@consts/api.path.const";
import type { ApiResponse } from "@app/interface/apiResponse.interface";
import type { CreateOrderFromCartRequest, SearchOrdersQuery } from "../../types/order/Order.req.type";
import type { OrderResponse, PagedOrderResponse } from "../../types/order/Order.res.type";

export const OrderService = {
    // POST /Orders/create-from-cart
    createFromCart(payload: CreateOrderFromCartRequest) {
        return BaseService.post<ApiResponse<OrderResponse>>({
            url: API_PATH.ORDER.CREATE_FROM_CART,
            payload,
        });
    },

    // GET /Orders/search
    search(query: SearchOrdersQuery) {
        return BaseService.get<ApiResponse<PagedOrderResponse>>({
            url: API_PATH.ORDER.SEARCH,
            payload: query as any,
        });
    },

    // GET /Orders/{orderId}
    getById(orderId: string) {
        return BaseService.get<ApiResponse<OrderResponse>>({
            url: API_PATH.ORDER.GET_BY_ID(orderId),
        });
    },

    // PUT /Orders/{id}/confirm
    confirm(id: string) {
        return BaseService.put<ApiResponse<void>>({
            url: API_PATH.ORDER.CONFIRM(id),
        });
    },

    // PUT /Orders/{id}/process
    process(id: string) {
        return BaseService.put<ApiResponse<void>>({
            url: API_PATH.ORDER.PROCESS(id),
        });
    },

    // PUT /Orders/{id}/deliver
    deliver(id: string) {
        return BaseService.put<ApiResponse<void>>({
            url: API_PATH.ORDER.DELIVER(id),
        });
    },
};
