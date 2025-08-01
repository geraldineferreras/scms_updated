import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const AuthGuard = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Check if user is trying to access protected routes without authentication
    const isProtectedRoute = location.pathname.startsWith('/admin') || 
                           location.pathname.startsWith('/teacher') || 
                           location.pathname.startsWith('/student') ||
                           location.pathname.startsWith('/video-conference');

    if (!loading && isProtectedRoute && !isAuthenticated()) {
      // Clear any remaining authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('scms_logged_in_user');
      
      // Redirect to logout page
      window.location.replace('/auth/logout');
    }
  }, [location, isAuthenticated, loading]);

  return null;
};

export default AuthGuard; 