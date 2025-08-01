import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

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

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated()) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;
    
    let redirectPath = '/admin/index';
    if (role === 'teacher') {
      redirectPath = '/teacher/index';
    } else if (role === 'student') {
      redirectPath = '/student/index';
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute; 