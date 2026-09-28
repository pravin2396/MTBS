import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword as resetPasswordService,
  getRememberedEmail,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rememberedEmail, setRememberedEmail] = useState('');

  // Hydrate user session and remembered email from localStorage on mount
  useEffect(() => {
    try {
      const activeUser = getCurrentUser();
      if (activeUser) {
        setUser(activeUser);
      }
      setRememberedEmail(getRememberedEmail());
    } catch (err) {
      console.error('Session hydration failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, password, rememberMe }) => {
    const sessionUser = await loginUser({ email, password, rememberMe });
    setUser(sessionUser);
    if (rememberMe) {
      setRememberedEmail(email);
    } else {
      setRememberedEmail('');
    }
    return sessionUser;
  };

  const register = async ({ name, email, password }) => {
    const sessionUser = await registerUser({ name, email, password });
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const resetUserPassword = async ({ email, newPassword }) => {
    return await resetPasswordService({ email, newPassword });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    rememberedEmail,
    login,
    register,
    logout,
    resetPassword: resetUserPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
