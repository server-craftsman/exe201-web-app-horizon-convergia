import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// import page 
const BuyerDashboard = lazy(() => import("../../../pages/buyer/Dashboard"));
const SettingsPage = lazy(() => import("../../../pages/auth/settings"));
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
    ],
};

