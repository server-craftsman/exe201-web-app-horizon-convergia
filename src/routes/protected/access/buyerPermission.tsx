import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// import page 
const BuyerDashboard = lazy(() => import("../../../pages/buyer/overview/Dashboard.page"));
const SettingsPage = lazy(() => import("../../../pages/auth/settings"));
const OrderHistoryPage = lazy(() => import("../../../pages/buyer/order/History.page"));
const OrderDetailPage = lazy(() => import("../../../pages/buyer/order/Detail.page"));

export const BuyerRoutes: RouteObject = {
    path: ROUTER_URL.BUYER.BASE,
    children: [
        {
            index: true,
            element: <BuyerDashboard />,
        },
        {
            path: ROUTER_URL.BUYER.SETTINGS,
            element: <SettingsPage />,
        },
        {
            path: ROUTER_URL.BUYER.ORDER_HISTORY,
            element: <OrderHistoryPage />,
        },
        {
            path: ROUTER_URL.BUYER.ORDER_DETAIL,
            element: <OrderDetailPage />,
        },
    ],
};

