import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* === ЛЕВАЯ КОЛОНКА: сайдбар === */}
      <aside className="sidebar">
        {/* Логотип */}
        <div className="sidebar__logo">Казначейство</div>

        {/* Основная навигация */}
        <nav className="sidebar__nav">
          <NavLink
            to="/claims"
            className={({ isActive }) => 'sidebar__link' + (isActive ? ' active' : '')}
          >
            Заявки
          </NavLink>
          <NavLink
            to="/contractors"
            className={({ isActive }) => 'sidebar__link' + (isActive ? ' active' : '')}
          >
            Контрагенты
          </NavLink>
          <NavLink
            to="/accounts"
            className={({ isActive }) => 'sidebar__link' + (isActive ? ' active' : '')}
          >
            Счета
          </NavLink>
        </nav>

        {/* Разделитель */}
        <div className="sidebar__divider" />

        {/* Нижняя навигация */}
        <nav className="sidebar__nav sidebar__nav--bottom">
          <NavLink
            to="/notifications"
            className={({ isActive }) => 'sidebar__link' + (isActive ? ' active' : '')}
          >
            Уведомления
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => 'sidebar__link' + (isActive ? ' active' : '')}
          >
            Профиль
          </NavLink>
          <button className="sidebar__logout" onClick={handleLogout}>
            Выход
          </button>
        </nav>
      </aside>

      {/* === ПРАВАЯ КОЛОНКА: контент + шапка === */}
      <div className="layout__right">
        {/* Шапка с юзером */}
        <header className="layout__header">
          <div className="user-badge">
            <div className="user-badge__avatar">
              {user?.fullName?.charAt(0) || '?'}
            </div>
            <div className="user-badge__info">
              <span className="user-badge__name">{user?.fullName}</span>
              <span className="user-badge__role">{roleLabel(user?.role)}</span>
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

function roleLabel(role) {
  const map = {
    USER: 'Пользователь',
    DIRECTOR: 'Директор',
    FIN_MANAGER: 'Фин. менеджер',
  };
  return map[role] || role;
}