import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTER_URL } from "../../consts/router.path.const";
import { useAuth } from "../../hooks/useAuth";

interface GuardProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const GuardProtectedRoute: React.FC<GuardProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { getCurrentRole, isAuthenticated, getDefaultPath } = useAuth();
  const currentRole = getCurrentRole();

  if (!isAuthenticated()) {
    return <Navigate to={ROUTER_URL.AUTH.LOGIN} replace />;
  }

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    const defaultPath = getDefaultPath(currentRole as any);
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
};

export default GuardProtectedRoute;