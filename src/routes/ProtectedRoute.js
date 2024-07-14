import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/auth/AuthState';
import { complexString } from '../utils/complexString';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={`/${complexString}/admin`} />
  );
};

export default ProtectedRoute;
