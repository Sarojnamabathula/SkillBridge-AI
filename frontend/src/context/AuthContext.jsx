import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillbridge_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('skillbridge_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      loadProfile();
    }
  }, [token]);

  const loadProfile = async () => {
    try {
      const uData = await fetchCurrentUser();
      setUser(uData);
      localStorage.setItem('skillbridge_user', JSON.stringify(uData));
    } catch (e) {
      logout();
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('skillbridge_token', data.access_token);
      localStorage.setItem('skillbridge_user', JSON.stringify(data.user));
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (email, password, fullName) => {
    setLoading(true);
    try {
      const data = await registerUser(email, password, fullName);
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('skillbridge_token', data.access_token);
      localStorage.setItem('skillbridge_user', JSON.stringify(data.user));
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
