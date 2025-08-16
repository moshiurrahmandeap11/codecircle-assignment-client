import React from 'react';
import { Navigate, Outlet } from 'react-router';
import UseAuthHook from '../../hooks/contexthooks/UseAuthHook';
import Loader from '../../components/Loader/Loader';

const ProtectedRoute = () => {
  const { user, loading } = UseAuthHook();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ User is logged in — render the nested route
  return <Outlet />;
};

export default ProtectedRoute;
