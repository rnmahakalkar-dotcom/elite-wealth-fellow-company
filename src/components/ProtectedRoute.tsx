import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: ReactNode;
  requiredRole?: 'super_admin' | 'manager' | 'office_staff';
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requiredRole, requireAuth = true }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && (!user || !profile)) {
    return <Navigate to="/auth" replace />;
  }

  if (!requireAuth && user && profile) {
    return <Navigate to="/" replace />;
  }

  if (requireAuth && requiredRole && user && profile) {
    const roleHierarchy = {
      'office_staff': 1,
      'manager': 2,
      'super_admin': 3
    };

    const userLevel = roleHierarchy[profile.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    if (userLevel < requiredLevel) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return children ? <>{children}</> : <Outlet />;
}