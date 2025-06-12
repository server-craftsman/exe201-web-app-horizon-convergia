import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTER_URL } from "../../consts/router.path.const";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../app/enums";

interface GuardProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[] | "";
}

const GuardProtectedRoute: React.FC<GuardProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {
  const { getCurrentRole } = useAuth();
  const currentRole = getCurrentRole();
  const location = useLocation();

  // Add logging to help debug
  useEffect(() => {
    console.log('GuardProtectedRoute - Current role:', currentRole);
    console.log('GuardProtectedRoute - Allowed roles:', allowedRoles);
    console.log('GuardProtectedRoute - Current path:', location.pathname);
    console.log('GuardProtectedRoute - Includes role:',
      currentRole && allowedRoles ? allowedRoles.includes(currentRole) : false);
  }, [currentRole, allowedRoles, location.pathname]);



  // If not in allowed roles, redirect to home
  if (!currentRole || !allowedRoles || !allowedRoles.includes(currentRole)) {
    console.log(`Role ${currentRole} not in allowed roles:`, allowedRoles);
    return <Navigate to={ROUTER_URL.COMMON.HOME} replace />;
  }

  // User is authenticated and authorized
  console.log('User is authorized, rendering children');
  return <>{children}</>;
};

export default GuardProtectedRoute;