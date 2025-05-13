// import { lazy } from "react";
import { ROUTER_URL } from "../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

//================= PUBLIC SUB PATHS =================
// const LoginPage = lazy(() => import("../../pages/login/LoginPage"));
//======================================================
//export public sub paths
export const publicSubPaths: Record<string, RouteObject[]> = {
  [ROUTER_URL.COMMON.HOME]: [
    // {
    //   element: <MainLayout />,
    //   children: [
    //     {
    //       path: ROUTER_URL.COMMON.HOME,
    //       element: <HomePage />
    //     }
    //   ]
    // }
  ],
};