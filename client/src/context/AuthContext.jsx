import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('creatorsync_token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (err) {
          console.error('Session validation failed, logging out...');
          localStorage.removeItem('creatorsync_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Login handler
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password, rememberMe });
      localStorage.setItem('creatorsync_token', data.token);
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Register handler (unverified by default)
  const register = async (name, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      setLoading(false);
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Verify Email handler
  const verifyEmail = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/auth/verify/${token}`);
      setLoading(false);
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Verification link is invalid or has expired.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Forgot Password request handler
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/forgotpassword', { email });
      setLoading(false);
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Recovery email failed to send.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Reset Password request handler
  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/auth/resetpassword/${token}`, { password });
      setLoading(false);
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Reset token is invalid or has expired.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('creatorsync_token');
    setUser(null);
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put('/users/profile', profileData);
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Profile update failed.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        verifyEmail,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
