import { lazy } from "react";
import { ROUTER_URL } from "../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";
import MainLayout from "../../layouts/main/Main.layout";

//================= PUBLIC SUB PATHS =================
const HomePage = lazy(() => import("../../pages/client/home"));
const BuyMotorPage = lazy(() => import("../../pages/client/buy_motor"));
const SellMotorPage = lazy(() => import("../../pages/client/sell_motor"));
const AccessoriesPage = lazy(() => import("../../pages/client/accessories"));
const NewsPage = lazy(() => import("../../pages/client/news"));
// auth pages
const LoginPage = lazy(() => import("../../pages/auth/login"));
const RegisterPage = lazy(() => import("../../pages/auth/register"));
const VerifyEmailPage = lazy(() => import("../../pages/auth/verify_email"));
const ResetPasswordPage = lazy(() => import("../../pages/auth/reset_password"));
const ForgotPasswordPage = lazy(() => import("../../pages/auth/forgot_password"));
// product
const ProductListByCategoryIdPage = lazy(() => import("../../components/client/home/ProductListByCategoryId.com"));
const ProductDetailsPage = lazy(() => import("../../components/client/home/product/ProductDetails.com"));


//======================================================
//export public sub paths
export const publicSubPaths: Record<string, RouteObject[]> = {
  [ROUTER_URL.COMMON.HOME]: [
    {
      element: <MainLayout />,
      children: [
        {
          path: ROUTER_URL.CLIENT.PRODUCT_LIST_BY_CATEGORY_ID,
          element: <ProductListByCategoryIdPage />
        },
        {
          path: ROUTER_URL.CLIENT.PRODUCT_DETAIL,
          element: <ProductDetailsPage />
        },
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
        },
        {
          path: ROUTER_URL.AUTH.VERIFY_EMAIL,
          element: <VerifyEmailPage />
        },
        {
          path: ROUTER_URL.AUTH.FORGOT_PASSWORD,
          element: <ForgotPasswordPage />
        },
        {
          path: ROUTER_URL.AUTH.RESET_PASSWORD,
          element: <ResetPasswordPage />
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
