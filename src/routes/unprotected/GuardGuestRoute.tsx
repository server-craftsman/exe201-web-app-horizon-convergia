import React from "react";

interface GuardGuestRouteProps {
  component: React.ReactNode;
}

const GuardGuestRoute = ({ component }: GuardGuestRouteProps) => <div>{component}</div>;

export default GuardGuestRoute;