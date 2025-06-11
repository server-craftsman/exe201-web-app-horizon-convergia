// import { lazy } from "react";
import { ROUTER_URL } from "../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";
import MainLayout from "../../layouts/main/main.layout";

//================= PUBLIC SUB PATHS =================
import HomePage from "../../pages/client/home";
import LoginPage from "../../pages/client/login";
import RegisterPage from "../../pages/client/register";
import BuyMotorPage from "../../pages/client/buy_motor";
import SellMotorPage from "../../pages/client/sell_motor";
import AccessoriesPage from "../../pages/client/accessories";
import NewsPage from "../../pages/client/news";
//======================================================
//export public sub paths
export const publicSubPaths: Record<string, RouteObject[]> = {
  [ROUTER_URL.COMMON.HOME]: [
    {
      element: <MainLayout />,
      children: [
        {
          path: ROUTER_URL.COMMON.HOME,
          element: <HomePage />
        },
        {
          path: ROUTER_URL.CLIENT.BUY_MOTOR,
          element: <BuyMotorPage />
        },
        {
          path: ROUTER_URL.CLIENT.SELL_MOTOR,
          element: <SellMotorPage />
        },
        {
          path: ROUTER_URL.CLIENT.ACCESSORIES,
          element: <AccessoriesPage />
        },
        {
          path: ROUTER_URL.CLIENT.NEWS,
          element: <NewsPage />
        }
      ]
    }
  ],
  [ROUTER_URL.AUTH.LOGIN]: [
    {
      path: ROUTER_URL.AUTH.LOGIN,
      element: <LoginPage />
    }
  ],
  [ROUTER_URL.AUTH.SIGN_UP]: [
    {
      path: ROUTER_URL.AUTH.SIGN_UP,
      element: <RegisterPage />
    }
  ]
};
