import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const HistoryBlocker = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Only apply history blocking when not loading and not authenticated
    if (!loading && !isAuthenticated()) {
      const handlePopState = (event) => {
        // Prevent back button from working when not authenticated
        if (!isAuthenticated()) {
          // Push current state back to prevent navigation
          window.history.pushState(null, '', location.pathname);
          
          // Dispatch a custom event to show logout message
          window.dispatchEvent(new CustomEvent('showLogoutMessage'));
        }
      };

      // Listen for browser back/forward button clicks
      window.addEventListener('popstate', handlePopState);

      // Push current state to history to enable back button detection
      window.history.pushState(null, '', location.pathname);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isAuthenticated, loading, location]);

  // Don't render anything, this is just a utility component
  return null;
};

export default HistoryBlocker; 