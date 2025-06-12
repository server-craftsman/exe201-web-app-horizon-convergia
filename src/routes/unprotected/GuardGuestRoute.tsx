import React from "react";

interface GuardGuestRouteProps {
  component: React.ReactNode;
  redirectPath?: string;
}

const GuardGuestRoute = ({ component }: GuardGuestRouteProps) => {  // Allow all roles to access public routes
  return <>{component}</>;
};

export default GuardGuestRoute;