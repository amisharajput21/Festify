import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_USER_KEY = 'festify_current_user';

const DEMO_USER = {
  id: 'usr-001',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  phone: '+91 98765 43210',
  city: 'Mumbai',
  role: 'ROLE_USER'
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(DEMO_USER);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(DEMO_USER));
      }
    } catch {
      setUser(DEMO_USER);
    }
  }, []);

  const login = async (email) => {
    const loggedUser = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email,
      phone: '+91 98765 43210',
      city: 'Mumbai',
      role: 'ROLE_USER'
    };
    setUser(loggedUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(loggedUser));
    setIsAuthModalOpen(false);
    return true;
  };

  const register = async (name, email, phone, city) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      city,
      role: 'ROLE_USER'
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

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
