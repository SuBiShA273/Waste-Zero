import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('wastezero_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('wastezero_token');
      if (storedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          setToken(storedToken);
        } catch (err) {
          console.error('Failed to restore session:', err);
          localStorage.removeItem('wastezero_token');
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
    localStorage.setItem('wastezero_token', newToken);
    setToken(newToken);
    setUser(userData);
    return response;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    const { token: newToken, user: userData } = response;
    localStorage.setItem('wastezero_token', newToken);
    setToken(newToken);
    setUser(userData);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('wastezero_token');
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
