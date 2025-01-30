import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../services/authServices";

const PrivateRoute = () => {
    // Check if the token exists
    const isAuthenticated = !!getToken();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
