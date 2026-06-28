import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);
const TOKEN_KEY = 'treasury_token';
const USER_KEY  = 'treasury_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    client.get('/auth/me')
      .then((res) => {
        // бэкенд возвращает ApiResponse<UserResponse>: {success, message, data: {id, login, fullName, role}}
        const u = res.data.data;
        const safeUser = {
          login: u.login,
          fullName: u.fullName,
          role: u.role,
        };
        setUser(safeUser);
        localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      });
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else      localStorage.removeItem(USER_KEY);
  }, [user]);

  const login = async (login, password) => {
    const res = await client.post('/auth/login', { login, password });
    // ApiResponse<AuthResponse>: {success, message, data: {token, login, fullName, role}}
    const data = res.data.data;
    localStorage.setItem(TOKEN_KEY, data.token);
    const safeUser = {
      login: data.login,
      fullName: data.fullName,
      role: data.role,
    };
    setUser(safeUser);
    return safeUser;
  };

  const register = async ({ login, password, fullName, role }) => {
    const res = await client.post('/auth/register', {
      login, password, fullName, role,
    });
    const data = res.data.data;
    localStorage.setItem(TOKEN_KEY, data.token);
    const safeUser = {
      login: data.login,
      fullName: data.fullName,
      role: data.role,
    };
    setUser(safeUser);
    return safeUser;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth нужно вызывать внутри <AuthProvider>');
  return ctx;
}