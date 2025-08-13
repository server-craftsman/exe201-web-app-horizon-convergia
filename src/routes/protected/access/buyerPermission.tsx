import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// import page 
const BuyerDashboard = lazy(() => import("../../../pages/buyer/overview/Dashboard.page"));
const SettingsPage = lazy(() => import("../../../pages/auth/settings"));
const OrderHistoryPage = lazy(() => import("../../../pages/buyer/order/History.page"));
const OrderDetailPage = lazy(() => import("../../../pages/buyer/order/Detail.page"));
// favorite
const FavoritePage = lazy(() => import("../../../pages/client/favorite"));
export const BuyerRoutes: RouteObject = {
    path: ROUTER_URL.BUYER.BASE, // '/buyer'
    children: [
        {
            index: true,
            element: <BuyerDashboard />,
        },
        {
            path: ROUTER_URL.BUYER.SETTINGS, // from '/buyer/cai-dat'
            element: <SettingsPage />,
        },
        {
            path: ROUTER_URL.BUYER.ORDER_HISTORY, // from '/buyer/lich-su-don-hang'
            element: <OrderHistoryPage />,
        },
        {
            path: ROUTER_URL.BUYER.ORDER_DETAIL, // from '/buyer/don-hang/:id'
            element: <OrderDetailPage />,
        },
        {
            path: ROUTER_URL.BUYER.FAVORITE, // from '/buyer/yeu-thich'
            element: <FavoritePage />,
        },
    ],
};

