import React, { Suspense } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from 'react-router-dom';
import { UserRole } from "../../app/enums";
import Loading from "../../app/screens/Loading";
import { AdminRoutes } from "./access/adminPermission";
import { ROUTER_URL } from "../../consts/router.path.const";
import { useUserInfo } from "../../hooks";

const useProtectedRoutes = (): RouteObject[] => {
  const user = useUserInfo();
  const role = user?.role as UserRole | null;

  let roleBasedRoutes: RouteObject[] = [];

  if (!role) {
    return [
      {
        path: "*",
        element: <Navigate to="/" />
      }
    ];
  }

  const mapRoutes = (routes: RouteObject[], allowedRole: UserRole): RouteObject[] => {
    return routes.map((route) => {
      if ("index" in route && route.index) {
        return {
          ...route,
          element: <Suspense fallback={<Loading />}>{role === allowedRole ? route.element : <Navigate to="/" replace />}</Suspense>
        };
      }
      return {
        ...route,
        element: (<Suspense fallback={<Loading />}>{role === allowedRole && route.element ? (route.element as React.ReactElement) : <Navigate to="/" replace />}</Suspense>) as React.ReactElement,
        children: Array.isArray(route.children) ? mapRoutes(route.children, allowedRole) : undefined
      };
    });
  };

  switch (role) {
    case UserRole.ADMIN:
      roleBasedRoutes = mapRoutes(AdminRoutes.children || [], UserRole.ADMIN) as RouteObject[];
      break;
    default:
      roleBasedRoutes = [
        {
          path: "*",
          element: <Navigate to="/" />
        }
      ];
  }

  return roleBasedRoutes;
};

export default useProtectedRoutes;