import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // If user is InvestorsCMS, only allow access to investors-cms page
  if (user?.user_type === 'InvestorsCMS') {
    const path = location.pathname;
    if (path !== '/admin/dashboard/investors-cms' && path !== '/admin/dashboard') {
      // Redirect to investors-cms if trying to access other pages
      return <Navigate to="/admin/dashboard/investors-cms" replace />;
    }
  }

  return <>{children}</>;
}

