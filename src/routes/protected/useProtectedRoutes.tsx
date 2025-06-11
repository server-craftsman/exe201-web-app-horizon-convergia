import React, { useEffect, useState, Suspense } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from 'react-router-dom';
import { UserRole } from "../../app/enums";
import Loading from "../../app/screens/Loading";
import { AdminRoutes } from "./access/adminPermission";
import { ROUTER_URL } from "../../consts/router.path.const";
import { useLocalStorage } from "../../hooks/useLocalstorage";

const useProtectedRoutes = (): RouteObject[] => {
  const [role, setRole] = useState<UserRole | null>(null);
  const { getItem } = useLocalStorage();
  useEffect(() => {
    const storedRole = getItem("role");
    console.log("storedRole", storedRole); // Kiểm tra giá trị storedRole
    if (storedRole) {
      setRole(storedRole as UserRole);
      console.log("Role set to:", storedRole); // Kiểm tra sau khi setRole
    }
  }, []);

  let roleBasedRoutes: RouteObject[] = [];

  // Ensure role is set before proceeding
  if (role === null) {
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
      console.log("Admin role detected");
      console.log("Admin routes:", AdminRoutes); // Debug: Kiểm tra adminRoutes
      roleBasedRoutes = mapRoutes(AdminRoutes[ROUTER_URL.ADMIN.BASE], UserRole.ADMIN) as RouteObject[];
      break;
    default:
      console.log("No valid role detected");
      roleBasedRoutes = [
        {
          path: "*",
          element: <Navigate to="/" />
        }
      ];
      console.log("roleBasedRoutes", roleBasedRoutes); // Debug: Kiểm tra roleBasedRoutes
  }

  // Return only the role-based routes, excluding the index route
  return roleBasedRoutes;
};

export default useProtectedRoutes;