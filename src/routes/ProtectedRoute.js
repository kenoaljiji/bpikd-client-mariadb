import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/auth/AuthState";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin" />;
};

export default ProtectedRoute;
