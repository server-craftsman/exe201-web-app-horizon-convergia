import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// import page 
const BuyerDashboard = lazy(() => import("../../../pages/buyer/overview/Dashboard.page"));
const SettingsPage = lazy(() => import("../../../pages/auth/settings"));
const OrderHistoryPage = lazy(() => import("../../../pages/buyer/order/History.page"));
const OrderDetailPage = lazy(() => import("../../../pages/buyer/order/Detail.page"));

export const BuyerRoutes: RouteObject = {
    path: ROUTER_URL.BUYER.BASE, // '/buyer'
    children: [
        {
            index: true,
            element: <BuyerDashboard />,
        },
        {
            path: "cai-dat", // from '/buyer/cai-dat'
            element: <SettingsPage />,
        },
        {
            path: "lich-su-don-hang", // from '/buyer/lich-su-don-hang'
            element: <OrderHistoryPage />,
        },
        {
            path: "don-hang/:id", // from '/buyer/don-hang/:id'
            element: <OrderDetailPage />,
        },
    ],
};

