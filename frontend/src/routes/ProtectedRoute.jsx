import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sprout } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-emerald-400 gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <Sprout className="w-7 h-7 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-sm font-medium tracking-wide text-slate-400 uppercase">
          Verifying Agronomist Credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
