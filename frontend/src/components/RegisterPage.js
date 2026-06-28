import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('Заполните все поля');
      return;
    }
    if (password.length < 4) {
      setError('Пароль должен быть не короче 4 символов');
      return;
    }

    setLoading(true);
    try {
      await register({

                login: email,

                password,

                fullName,

                role: 'USER',   // бэкенд принимает строки USER, APPROVER, PAYMENT_MANAGER, ADMIN

              });
      navigate('/claims');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Регистрация</h1>

        <form onSubmit={handleSubmit} className="auth-card__form">
          <div className="field">
            <label htmlFor="fullName">ФИО</label>
            <input
              id="fullName"
              type="text"
              placeholder="Введите ФИО"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email (используется как логин)</label>
            <input
              id="email"
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label htmlFor="department">Подразделение</label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Выберите подразделение</option>
              <option value="Маркетинг">Маркетинг</option>
              <option value="Канцелярия">Канцелярия</option>
              <option value="Бухгалтерия">Бухгалтерия</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              placeholder="Придумайте пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && <div className="auth-card__error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-card__footer">
          Есть аккаунт?{' '}
          <Link to="/login" className="link-button">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}