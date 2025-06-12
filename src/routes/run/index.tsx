import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, Suspense } from "react";
import { ROUTER_URL } from "../../consts/router.path.const";
import { UserRole } from "../../app/enums";
import GuardPublicRoute from "../unprotected/GuardGuestRoute";
import GuardProtectedRoute from "../protected/GuardProtectedRoute";
import { publicSubPaths } from "../unprotected/GuestSubPaths";
import AdminLayout from "../../layouts/admin/Admin.layout";
import { AdminRoutes } from "../protected/access/adminPermission";
import { useUserInfo, useAuth } from "../../hooks";

const RunRoutes = () => {
  const user = useUserInfo();
  const currentRole = user?.role as UserRole | null;
  const { getDefaultPath } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentRole && window.location.pathname === "/") {
      const defaultPath = getDefaultPath(currentRole);
      navigate(defaultPath, { replace: true });
    }
  }, [navigate, currentRole, getDefaultPath]);

  return (
    <Routes>
      {/* Public Routes */}
      {Object.entries(publicSubPaths).map(([key, routes]) =>
        routes.map((route) => (
          <Route 
            key={route.path || "index"} 
            path={route.path} 
            element={key === ROUTER_URL.COMMON.HOME ? <GuardPublicRoute component={route.element} /> : route.element}
          >
            {route.children?.map((childRoute) => (
              <Route 
                key={childRoute.path} 
                path={childRoute.path} 
                element={childRoute.element} 
              />
            ))}
          </Route>
        ))
      )}

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <GuardProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminLayout />
          </GuardProtectedRoute>
        }
      >
        <Route 
          index 
          element={
            <Suspense fallback={<div>Loading...</div>}>
              {AdminRoutes[ROUTER_URL.ADMIN.BASE].find(route => route.index)?.element}
            </Suspense>
          } 
        />
        {AdminRoutes[ROUTER_URL.ADMIN.BASE]
          .filter(route => !route.index)
          .map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  {route.element}
                </Suspense>
              }
            />
          ))
        }
      </Route>
    </Routes>
  );
};

export default RunRoutes;