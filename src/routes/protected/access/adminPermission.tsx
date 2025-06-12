import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// import page 
const OverviewPage = lazy(() => import("../../../pages/admin/overview"));
const UserManagementPage = lazy(() => import("../../../pages/admin/user"));
const SettingManagementPage = lazy(() => import("../../../pages/auth/settings"));
export const AdminRoutes: RouteObject = {
    path: ROUTER_URL.ADMIN.BASE,
    children: [
        {
            index: true,
            element: <OverviewPage />,
        },
        {
            path: ROUTER_URL.ADMIN.USERS,
            element: <UserManagementPage />,
        },
        {
            path: ROUTER_URL.ADMIN.SETTINGS,
            element: <SettingManagementPage />,
        }
    ],
};

