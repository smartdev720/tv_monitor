import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ element }) => {
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/main" replace />;
  }

  return element;
};
