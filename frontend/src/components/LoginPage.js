import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onSwitchToRegister, onLogin }) {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!login || !password) {
            setError('Заполните все поля');
            return;
        }

        setError('');
        setIsLoading(true);

        // Имитация запроса к серверу (пока заглушка)
        console.log('Вход:', { login, password });

        setTimeout(() => {
          setIsLoading(false);

          if (login === 'admin' && password === 'admin') {
            onLogin();              // ← вернули, без аргументов
          } else if (login === 'user' && password === 'user') {
            onLogin();              // ← вернули
          } else if (login === 'finmanager' && password === 'finmanager') {
            onLogin();              // ← вернули
          } else {
            setError('Неверный логин или пароль');
          }
        }, 1000);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                {/* Логотип/заголовок */}
                <div className="login-header">
                    <h1>Вход в систему</h1>
                    <p>Система согласования заявок</p>
                </div>

                {/* Форма входа */}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="login">Логин</label>
                        <input
                            id="login"
                            type="text"
                            placeholder="Введите логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Ошибка */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Кнопка входа */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                    <div className="login-footer">
                      Нет аккаунта?{' '}
                      <button
                        type="button"
                        className="link-button"
                        onClick={onSwitchToRegister}
                      >
                        Зарегистрироваться
                      </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;