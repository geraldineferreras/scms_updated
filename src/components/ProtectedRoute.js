import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to logout page
  if (!isAuthenticated()) {
    // Clear any existing authentication data to prevent back button issues
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('scms_logged_in_user');
    
    // Replace the current history entry to prevent back button from working
    window.history.replaceState(null, '', '/auth/logout');
    
    return <Navigate to="/auth/logout" replace state={{ from: location }} />;
  }

  // If role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && !hasRole(requiredRole)) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;
    
    let redirectPath = '/auth/login';
    if (role === 'admin') {
      redirectPath = '/admin/index';
    } else if (role === 'teacher') {
      redirectPath = '/teacher/index';
    } else if (role === 'student') {
      redirectPath = '/student/index';
    }
    
    // Clear authentication data if role mismatch
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('scms_logged_in_user');
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute; 