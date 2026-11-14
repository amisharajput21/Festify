
import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/api.js';

const AuthContext = createContext(undefined);

const getSavedAuth = () => {
  try {
    const savedUser = localStorage.getItem('festify_user');
    const savedToken = localStorage.getItem('festify_token');

    if (!savedUser || !savedToken) {
      return { user: null, token: null };
    }

    return {
      user: JSON.parse(savedUser),
      token: savedToken
    };
  } catch {
    localStorage.removeItem('festify_user');
    localStorage.removeItem('festify_token');
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [savedAuth] = useState(getSavedAuth);
  const [user, setUser] = useState(savedAuth.user);
  const [token, setToken] = useState(savedAuth.token);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const saveAuth = (authData) => {
    setUser(authData.user);
    setToken(authData.token);

    localStorage.setItem('festify_user', JSON.stringify(authData.user));
    localStorage.setItem('festify_token', authData.token);
  };

  const login = async (email, password) => {
    const response = await authService.login({ email, password });

    saveAuth({
      user: response.user,
      token: response.token
    });

    setIsAuthModalOpen(false);
    return response.user;
  };

  const register = async (name, email, phone, city, password) => {
    await authService.signup({
      name,
      email,
      phone,
      city,
      password
    });

    // Signup ke baad automatically login karke JWT token lena.
    const response = await authService.login({ email, password });

    saveAuth({
      user: response.user,
      token: response.token
    });

    setIsAuthModalOpen(false);
    return response.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('festify_user');
    localStorage.removeItem('festify_token');

    setIsAuthModalOpen(false);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal
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
