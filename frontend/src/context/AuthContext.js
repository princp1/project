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
        const u = {
          login: res.data.login,
          fullName: res.data.fullName,
          role: res.data.role,
        };
        setUser(u);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
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
    const { data } = await client.post('/auth/login', { login, password });
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
    const { data } = await client.post('/auth/register', {
      login, password, fullName, role,
    });
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