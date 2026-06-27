// src/components/Layout.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      {/* === ЛЕВАЯ КОЛОНКА: сайдбар === */}
      <aside className="sidebar">
        {/* Логотип- название системы */}
        <div className="sidebar__logo">
          Казначейство
        </div>

        {/* Навигация */}
        <nav className="sidebar__nav">
          <NavLink
            to="/claims"
            className={({ isActive }) =>
              'sidebar__link' + (isActive ? ' active' : '')
            }
          >
            Заявки
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              'sidebar__link' + (isActive ? ' active' : '')
            }
          >
            Профиль
          </NavLink>
        </nav>

        {/* Кнопка выхода внизу */}
        <button
          type="button"
          className="sidebar__logout"
          onClick={logout}
        >
          Выход
        </button>
      </aside>

      {/* === ПРАВАЯ КОЛОНКА: контент + шапка === */}
      <div className="layout__right">
        {/* Шапка: название страницы (пока пусто, можно передать пропом) + юзер */}
        <header className="layout__header">
          {/* Юзер-бейдж справа */}
          <div className="user-badge">
            <div className="user-badge__avatar">
              {user?.fullName?.charAt(0) || '?'}
            </div>
            <div className="user-badge__info">
              <div className="user-badge__name">{user?.fullName}</div>
              <div className="user-badge__role">{roleLabel(user?.role)}</div>
            </div>
          </div>
        </header>

        {/* Основной контент */}
        <main className="layout__content">
          {children}
        </main>
      </div>
    </div>
  );
}

// Вспомогательная функция: код роли → красивое название
function roleLabel(role) {
  const map = {
    USER: 'Пользователь',
    DIRECTOR: 'Директор',
    FIN_MANAGER: 'Фин. менеджер',
  };
  return map[role] || role;
}