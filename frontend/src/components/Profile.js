import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const roleLabels = {
  USER: 'Пользователь',
  DIRECTOR: 'Директор',
  FIN_MANAGER: 'Фин. менеджер',
};

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-page">
      <h1 className="profile-page__title">Профиль</h1>
      <div className="profile-card">
        <div className="profile-card__avatar">
          {user.fullName.charAt(0)}
        </div>
        <div className="profile-card__fields">
          <div className="profile-row">
            <span className="profile-row__label">ФИО</span>
            <span className="profile-row__value">{user.fullName}</span>
          </div>
          <div className="profile-row">
            <span className="profile-row__label">Логин</span>
            <span className="profile-row__value">{user.login}</span>
          </div>
          <div className="profile-row">
            <span className="profile-row__label">Роль</span>
            <span className="profile-row__value">{roleLabels[user.role] || user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}