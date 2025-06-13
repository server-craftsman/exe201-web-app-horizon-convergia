import { Suspense } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from 'react-router-dom';
import { UserRole } from "../../app/enums";
import Loading from "../../app/screens/Loading";
import { AdminRoutes } from "./access/adminPermission";
import { useUserInfo } from "../../hooks";
// import AdminLayout from "../../layouts/admin/Admin.layout";
import { ROUTER_URL } from "../../consts/router.path.const";
//
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

  // Create a base route for admin
  if (role === UserRole.ADMIN) {
    return [
      {
        path: ROUTER_URL.ADMIN.BASE,
        // element: <AdminLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                {AdminRoutes.children?.find(route => route.index)?.element}
              </Suspense>
            )
          },
          ...(AdminRoutes.children?.filter(route => !route.index).map(route => ({
            path: route.path,
            element: (
              <Suspense fallback={<Loading />}>
                {route.element}
              </Suspense>
            )
          })) || [])
        ]
      }
    ];
  }

  // Default case - no protected routes for non-admin users
  return [
    {
      path: "*",
      element: <Navigate to="/" replace />
    }
  ];
};

export default useProtectedRoutes;