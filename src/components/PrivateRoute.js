import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Navbar from "./layouts/Navbar";

const PrivateRoute = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <Navigate to="/loadingpage" replace />; // Afficher un loader temporaire
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default PrivateRoute;
