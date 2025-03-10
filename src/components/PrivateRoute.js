import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>; // Prevents flickering when checking authentication state

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
