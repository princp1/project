import React, { useState } from 'react';
import './RegisterPage.css';

function RegisterPage({ onSwitchToLogin}) {
   const [fullName, setFullName] = useState('');
   const [email, setEmail] = useState('');
   const [department, setDepartment] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

    const handleSubmit = (e) => {

    e.preventDefault(); // не даём браузеру перезагрузить страницу

    if (!fullName || !email || !department || !password) {
      setError('Заполните все поля');
      return;

    }
    // Бэк-запрос сюда

    alert(`Регистрация!\nФИО: ${fullName}\nEmail: ${email}\nОтдел: ${department}`);

    setError('');
    };
      return (
        <div className="auth-page">
          <div className="auth-card">
            <h1 className="auth-card__title">Регистрация</h1>

            <form onSubmit={handleSubmit} className="auth-card__form">
              {/* Поле "ФИО" */}
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

              {/* Поле "Email" */}
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Введите адрес электронной почты"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Поле "Подразделение" */}
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

              {/* Поле "Пароль" */}
              <div className="field">
                <label htmlFor="password">Пароль</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Придумайте пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Сообщение об ошибке — показывается только если error не пустой */}
              {error && <div className="auth-card__error">{error}</div>}

              {/* Кнопка отправки */}
              <button type="submit" className="btn btn-primary btn-block">
                Зарегистрироваться
              </button>
            </form>

            {/* Ссылка для переключения на вход */}
            <div className="auth-card__footer">
              Есть аккаунт?{' '}
              <button
                type="button"
                className="link-button"
                onClick={onSwitchToLogin}
              >
                Войти
              </button>
            </div>
          </div>
        </div>
      );
    }

    export default RegisterPage;
