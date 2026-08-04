import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Debug logs
  console.log('🔒 ProtectedRoute:', { 
    requireAdmin, 
    hasUser: !!user, 
    isAdmin, 
    pathname: location.pathname,
    env: import.meta.env.MODE 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    console.log('🔒 No user, redirect to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('🔒 Access denied - not admin');
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center p-8 max-w-md mx-auto bg-background rounded-lg border shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            Admin privileges required for this page. Contact administrator if you believe this is an error.
          </p>
          <Button asChild>
            <Link to="/" className="w-full">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  console.log('🔒 Access granted');
  return <>{children}</>;
}
