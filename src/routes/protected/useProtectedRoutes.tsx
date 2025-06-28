import { Suspense } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from 'react-router-dom';
import type { ReactElement } from "react";
import { UserRole } from "../../app/enums";
import { AdminRoutes } from "./access/adminPermission";
import { useUserInfo } from "../../hooks";
import { BuyerRoutes } from "./access/buyerPermission";
import { SellerRoutes } from "./access/sellerPermission";
import { ShipperRoutes } from "./access/shipperPermission";
import AdminLayout from "../../layouts/admin/Admin.layout";
import BuyerLayout from "../../layouts/buyer/Buyer.layout";
import SellerLayout from "../../layouts/seller/Seller.layout";
import ShipperLayout from "../../layouts/shipper/Shipper.layout";
import { ROUTER_URL } from "../../consts/router.path.const";

const useProtectedRoutes = (): RouteObject[] => {
  const user = useUserInfo();
  const role = user?.role as UserRole | null;

  if (!role) {
    return [
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ];
  }

  // Helper to wrap child elements with Suspense & attach layout
  const createRouteWithLayout = (layoutElement: ReactElement, routeConfig: RouteObject): RouteObject => ({
    path: routeConfig.path,
    element: layoutElement,
    children: routeConfig.children?.map(child => ({
      ...child,
      element: (
        <Suspense>
          {child.element}
        </Suspense>
      )
    })) || []
  });

  switch (role) {
    case UserRole.ADMIN:
      return [
        createRouteWithLayout(<AdminLayout />, AdminRoutes),
        { path: "*", element: <Navigate to={ROUTER_URL.ADMIN.BASE} replace /> }
      ];

    case UserRole.BUYER:
      return [
        createRouteWithLayout(<BuyerLayout />, BuyerRoutes),
        { path: "*", element: <Navigate to={ROUTER_URL.BUYER.BASE} replace /> }
      ];

    case UserRole.SELLER:
      return [
        createRouteWithLayout(<SellerLayout />, SellerRoutes),
        { path: "*", element: <Navigate to={ROUTER_URL.SELLER.BASE} replace /> }
      ];

    case UserRole.SHIPPER:
      return [
        createRouteWithLayout(<ShipperLayout />, ShipperRoutes),
        { path: "*", element: <Navigate to={ROUTER_URL.SHIPPER.BASE} replace /> }
      ];

    default:
      return [
        { path: "*", element: <Navigate to="/" replace /> }
      ];
  }
};

export default useProtectedRoutes;