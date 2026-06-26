// frontend/src/App.js
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import './App.css';

function App() {
    const [user, setUser] = useState(null);

    // Функция, которая вызывается при успешном входе
    const handleLogin = (userData) => {
        setUser(userData);
        console.log('Пользователь вошёл:', userData);
    };

    // Если пользователь не авторизован — показываем страницу входа
    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    // Если авторизован — показываем главную страницу
    return (
        <div className="App">
            <h1>Добро пожаловать, {user.login}!</h1>
            <p>Ваша роль: {user.role}</p>
            <button onClick={() => setUser(null)}>Выйти</button>
        </div>
    );
}

export default App;