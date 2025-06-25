import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // List of public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/login',
    '/student-login',
    '/teacher-login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route)
  );

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // If user is not authenticated and trying to access protected route
    if (!user && !isPublicRoute) {
      // Save the attempted location for redirect after login
      navigate('/login', { 
        state: { from: location },
        replace: true 
      });
    }

    // If user is authenticated and trying to access auth pages (but not home or about)
    if (user && (location.pathname === '/login' || location.pathname === '/student-login' || location.pathname === '/teacher-login' || location.pathname === '/register')) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, location, navigate, isPublicRoute]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chargement de LearnMe</h3>
          <p className="text-gray-600">Veuillez patienter pendant que nous préparons votre expérience d'apprentissage...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;