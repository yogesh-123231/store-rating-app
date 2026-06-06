import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  const persistAuth = (authToken, authUser) => {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: authToken, user: authUser } = response.data;

    persistAuth(authToken, authUser);
    return { token: authToken, user: authUser };
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { token: authToken, user: authUser } = response.data;

    persistAuth(authToken, authUser);
    return { token: authToken, user: authUser };
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const changePassword = async (oldPassword, newPassword) => {
    await api.put('/auth/change-password', { oldPassword, newPassword });
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    changePassword,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function getDashboardPath(role) {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'OWNER':
      return '/owner/dashboard';
    case 'USER':
    default:
      return '/stores';
  }
}
