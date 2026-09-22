import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import type { Role } from "../api/types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole") as Role | null;

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !role) {
    return <Navigate to="/sign-in" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;