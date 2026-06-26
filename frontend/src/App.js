// src/App.js

import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ClaimsList from './components/ClaimsList';
import './App.css';

function App() {
  // Теперь 3 возможных значения: 'login', 'register', 'claims'
  const [page, setPage] = useState('login');

  // После успешного входа переключаемся на заявки
  const handleLogin = () => {
    setPage('claims');
  };

  // Выход — обратно на вход
  const handleLogout = () => {
    setPage('login');
  };

  // === Роутинг вручную: какой экран показать ===
  if (page === 'register') {
    return <RegisterPage onSwitchToLogin={() => setPage('login')} />;
  }

  if (page === 'claims') {
    return <ClaimsList onLogout={handleLogout} />;
  }

  // По умолчанию — вход
  return (
    <LoginPage
      onSwitchToRegister={() => setPage('register')}
      onLogin={handleLogin}      // <-- НОВОЕ: пробрасываем onLogin
    />
  );
}

export default App;