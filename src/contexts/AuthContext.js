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
      console.log('Login API response:', response); // Debugging line

      if (response && response.status) {
        // Support both {token, user} and flat user+token
        let user, token;
        if (response.data && response.data.user && response.data.token) {
          user = response.data.user;
          token = response.data.token;
        } else if (response.data && response.data.token) {
          // If user fields are at the top level of data
          user = { ...response.data };
          delete user.token;
          token = response.data.token;
        } else {
          // fallback for flat structure
          user = response.data;
          token = response.data.token;
        }
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('scms_logged_in_user', JSON.stringify(user));
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('scms_logged_in_user');
      setUser(null);
      setToken(null);
      // Navigate to login page
      window.location.href = '/auth/login';
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
    return !!user;
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
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 