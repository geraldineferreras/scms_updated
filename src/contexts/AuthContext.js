import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const refreshUserData = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    // const legacyUser = localStorage.getItem('scms_logged_in_user');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    } else {
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    refreshUserData();
    setLoading(false);
  }, []);

  // Listen for session timeout events
  useEffect(() => {
    const handleSessionTimeout = () => {
      console.log('Session timeout detected, logging out user');
      logout();
    };

    window.addEventListener('sessionTimeout', handleSessionTimeout);
    return () => window.removeEventListener('sessionTimeout', handleSessionTimeout);
  }, []);

  // Listen for localStorage changes (user switching)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'scms_logged_in_user' || e.key === 'user' || e.key === 'token') {
        refreshUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await ApiService.login(email, password);

      if (response && response.status) {
        // Enhanced token extraction with better error handling
        let user, token;
        
        // Check for token in various possible locations
        if (response.data && response.data.token) {
          token = response.data.token;
          // Extract user data, excluding the token
          user = { ...response.data };
          delete user.token;
        } else if (response.token) {
          token = response.token;
          user = { ...response };
          delete user.token;
        } else if (response.data && response.data.user && response.data.user.token) {
          token = response.data.user.token;
          user = { ...response.data.user };
          delete user.token;
        } else {
          // If no token found, this is a critical error
          console.error('No authentication token received from server');
          return { success: false, message: 'Authentication failed: No token received' };
        }

        // Validate token exists and is not empty
        if (!token || token.trim() === '') {
          console.error('Empty or invalid token received');
          return { success: false, message: 'Authentication failed: Invalid token' };
        }

        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('scms_logged_in_user', JSON.stringify(user));
        
        // Update state
        setUser(user);
        setToken(token);
        
        return { success: true, data: user };
      } else {
        return { success: false, message: response?.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await ApiService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('scms_logged_in_user');
      setUser(null);
      setToken(null);
      
      // Clear browser history to prevent back button from working
      // Push multiple states to clear the history stack
      for (let i = 0; i < 10; i++) {
        window.history.pushState(null, '', '/auth/login');
      }
      
      // Clear any cached authentication data
      sessionStorage.clear();
      
      // Navigate to login page and replace history
      window.location.replace('/auth/login');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await ApiService.updateProfile(userData);
      
      if (response.status) {
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('scms_logged_in_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true, data: updatedUser };
      } else {
        return { success: false, message: response.message || 'Update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: error.message || 'Update failed. Please try again.' };
    }
  };

  const isAuthenticated = () => {
    const storedToken = localStorage.getItem('token');
    return !!user && !!storedToken;
  };

  const hasValidToken = () => {
    const storedToken = localStorage.getItem('token');
    return !!storedToken && storedToken.trim() !== '';
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateProfile,
    refreshUserData,
    isAuthenticated,
    hasValidToken,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

 