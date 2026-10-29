import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('saree_store_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [authRole, setAuthRole] = useState('CUSTOMER');

  useEffect(() => {
    if (user) {
      localStorage.setItem('saree_store_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('saree_store_user');
    }
  }, [user]);

  const login = async (identifier, password) => {
    try {
      const res = await api.login({ identifier, password });
      if (res.success && res.data) {
        setUser(res.data);
        setIsAuthModalOpen(false);
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      // Local fallback for admin or offline testing if needed
      if (identifier === 'admin@sareevault.com' && password === 'admin123') {
        const adminUser = {
          id: 1,
          name: 'Store Admin',
          email: 'admin@sareevault.com',
          role: 'ROLE_ADMIN'
        };
        setUser(adminUser);
        setIsAuthModalOpen(false);
        return { success: true, user: adminUser };
      }
      return { success: false, message: err.message || 'Wrong password or email' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      if (res.success && res.data) {
        setUser(res.data);
        setIsAuthModalOpen(false);
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Failed to create account in database' };
    }
  };

  const forgotPassword = async (identifier) => {
    try {
      const res = await api.forgotPassword(identifier);
      return res;
    } catch (err) {
      return { success: false, message: err.message || 'Failed to send OTP' };
    }
  };

  const validateOtp = async (identifier, otp) => {
    try {
      const res = await api.validateOtp({ identifier, otp });
      return res;
    } catch (err) {
      return { success: false, message: err.message || 'Invalid or expired OTP' };
    }
  };

  const verifyOtp = async (identifier, otp, newPassword) => {
    try {
      const res = await api.verifyOtp({ identifier, otp, newPassword });
      if (res.success && res.data) {
        setUser(res.data);
        setIsAuthModalOpen(false);
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Verification failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid or expired OTP' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('saree_store_user');
  };

  const openAuth = (mode = 'login', role = 'CUSTOMER') => {
    setAuthMode(mode);
    setAuthRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuth = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN',
        isAuthModalOpen,
        authMode,
        setAuthMode,
        authRole,
        setAuthRole,
        login,
        register,
        forgotPassword,
        validateOtp,
        verifyOtp,
        logout,
        openAuth,
        closeAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
