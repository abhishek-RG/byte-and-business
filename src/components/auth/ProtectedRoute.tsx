
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, UserRole } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: UserRole;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // If loading is complete and either there's no user or role doesn't match
    if (!isLoading && (!user || profile?.role !== requiredRole)) {
      navigate('/login');
    }
  }, [user, profile, isLoading, navigate, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-relief-darkGreen" />
        <span className="ml-2 text-relief-darkCharcoal">Loading...</span>
      </div>
    );
  }

  // Only render children if user exists and has the correct role
  return (user && profile?.role === requiredRole) ? <>{children}</> : null;
};

export default ProtectedRoute;
