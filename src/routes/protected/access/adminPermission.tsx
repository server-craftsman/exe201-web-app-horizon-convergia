import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// import page 
const OverviewPage = lazy(() => import("../../../pages/admin/overview"));
const UserManagementPage = lazy(() => import("../../../pages/admin/user"));

export const AdminRoutes: Record<string, RouteObject[]> = {
    [ROUTER_URL.ADMIN.BASE]: [
        {
            index: true,
            element: <OverviewPage />,
        },
        {
            element: <UserManagementPage />,
            path: ROUTER_URL.ADMIN.USERS,
        },
    ],
};

