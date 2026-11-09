
import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/api.js';

const AuthContext = createContext(undefined);

const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem('festify_user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem('festify_user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getSavedUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const login = async (email, password) => {
    const loggedUser = await authService.login({ email, password });
    setUser(loggedUser);
    localStorage.setItem('festify_user', JSON.stringify(loggedUser));
    setIsAuthModalOpen(false);
    return loggedUser;
  };

  const register = async (name, email, phone, city, password) => {
    const newUser = await authService.signup({
      name,
      email,
      phone,
      city,
      password
    });

    setUser(newUser);
    localStorage.setItem('festify_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('festify_user');
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
        isAuthenticated: !!user,
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
