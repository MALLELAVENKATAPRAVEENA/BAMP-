import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-darkbg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-500"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Securing connection...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
};

export default ProtectedRoute;
