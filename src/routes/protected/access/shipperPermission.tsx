import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// import page 
const ShipperDashboard = lazy(() => import("../../../pages/shipper/Dashboard"));

export const ShipperRoutes: RouteObject = {
    path: ROUTER_URL.SHIPPER.BASE,
    children: [
        {
            index: true,
            element: <ShipperDashboard />,
        },

    ],
};

