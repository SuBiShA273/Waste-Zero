import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const getAuthToken = () => {
  return sessionStorage.getItem('wastezero_token') || localStorage.getItem('wastezero_token');
};

export const setAuthToken = (token) => {
  sessionStorage.setItem('wastezero_token', token);
  localStorage.setItem('wastezero_token', token);
};

export const removeAuthToken = () => {
  sessionStorage.removeItem('wastezero_token');
  localStorage.removeItem('wastezero_token');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          if (!sessionStorage.getItem('wastezero_token')) {
            sessionStorage.setItem('wastezero_token', storedToken);
          }
          const userData = await authService.getMe();
          setUser(userData);
          setToken(storedToken);
        } catch (err) {
          console.error('Failed to restore session:', err);
          removeAuthToken();
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { token: newToken, user: userData } = response;
    setAuthToken(newToken);
    setToken(newToken);
    setUser(userData);
    return response;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    const { token: newToken, user: userData } = response;
    setAuthToken(newToken);
    setToken(newToken);
    setUser(userData);
    return response;
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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

