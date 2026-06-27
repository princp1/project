// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаём "контейнер" для данных авторизации
const AuthContext = createContext(null);

// Кладём ключ в localStorage, чтобы после перезагрузки страницы
// пользователя не "выкидывало"
const STORAGE_KEY = 'treasury_user';

/**
 * AuthProvider — оборачивает всё приложение и даёт доступ к данным
 * авторизации через useAuth().
 */
export function AuthProvider({ children }) {
  // При запуске пытаемся восстановить пользователя из localStorage
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Каждый раз когда user меняется — сохраняем в localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  /**
   * login(login, password) — "заглушка", ищет в моке.
   * Когда подключишь бэк — замени на fetch('/api/auth/login', ...)
   */
  const login = async (login, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Моковые учётки
        const users = [
          { login: 'admin', password: 'admin', fullName: 'Абдурахманов И. А.', role: 'DIRECTOR' },
          { login: 'user', password: 'user', fullName: 'Попов И. Е.', role: 'USER' },
          { login: 'finmanager', password: 'finmanager', fullName: 'Сироткин В. Д.', role: 'FIN_MANAGER' },
        ];

        const found = users.find(
          (u) => u.login === login && u.password === password
        );
        if (found) {
          // Не храним пароль в стейте
          const { password: _, ...safeUser } = found;
          setUser(safeUser);
          resolve(safeUser);
        } else {
          reject(new Error('Неверный логин или пароль'));
        }
      }, 400); // имитация сетевого запроса
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth() — хук для удобного доступа к контексту.
 * Вызывать только внутри <AuthProvider>.
 * Пример: const { user, logout } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth нужно вызывать внутри <AuthProvider>');
  }
  return ctx;
}