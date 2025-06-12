import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useEffect, Suspense } from "react";
import { ROUTER_URL } from "../../consts/router.path.const";
import { UserRole } from "../../app/enums";
import GuardPublicRoute from "../unprotected/GuardGuestRoute";
import GuardProtectedRoute from "../protected/GuardProtectedRoute";
import { publicSubPaths } from "../unprotected/GuestSubPaths";
import { useUserInfo, useAuth } from "../../hooks";
import AdminLayout from "../../layouts/admin/Admin.layout";
import { AdminRoutes } from "../protected/access/adminPermission";
import Loading from "../../app/screens/Loading";

const RunRoutes = () => {
  const user = useUserInfo();
  const currentRole = user?.role as UserRole | null;
  const { isAuthenticated, getDefaultPath } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Log to help debug
    console.log("RunRoutes - Current user:", user);
    console.log("RunRoutes - Current role:", currentRole);
    console.log("RunRoutes - Is authenticated:", isAuthenticated());
    console.log("RunRoutes - Current path:", window.location.pathname);
    
    if (isAuthenticated() && currentRole && window.location.pathname === "/") {
      const defaultPath = getDefaultPath(currentRole);
      console.log("Redirecting to default path:", defaultPath);
      navigate(defaultPath, { replace: true });
    }
  }, [navigate, currentRole, getDefaultPath, user, isAuthenticated]);

  return (
    <Routes>
      {/* Public Routes */}
      {Object.entries(publicSubPaths).map(([key, routes]) =>
        routes.map((route) => (
          <Route 
            key={route.path || "index"} 
            path={route.path} 
            element={
              key === ROUTER_URL.COMMON.HOME ? (
                <GuardPublicRoute component={route.element} />
              ) : (
                route.element
              )
            }
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

      {/* Admin Layout Route */}
      <Route
        path={ROUTER_URL.ADMIN.BASE}
        element={
          <GuardProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminLayout />
          </GuardProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<Loading />}>
              {AdminRoutes.children?.find(route => route.index)?.element}
            </Suspense>
          }
        />
        {AdminRoutes.children?.filter(route => !route.index).map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<Loading />}>
                {route.element}
              </Suspense>
            }
          />
        ))}
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default RunRoutes;