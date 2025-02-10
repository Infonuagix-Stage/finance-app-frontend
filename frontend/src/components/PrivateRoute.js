import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../services/authServices";
import { useAuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";

const PrivateRoute = () => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar /> {/* Ajoutez le Navbar ici */}
      <Outlet /> {/* Ceci affiche le contenu de la route protégée */}
    </>
  );
};

export default PrivateRoute;
