// src/App.js

import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Layout from './components/Layout';
import ClaimsList from './components/ClaimsList';
import Profile from './components/Profile';
import './App.css';

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (loginVal, passwordVal) => {
    try {
      await login(loginVal, passwordVal);
      // AuthContext обновит user → RequireAuth пропустит на /claims
    } catch (err) {
      // пробрасываем ошибку дальше, LoginPage её покажет
      throw err;
    }
  };

  return (
    <Routes>
      {/* Публичные — только если не залогинен */}
      {!user && (
        <>
          <Route
            path="/login"
            element={
              <LoginPage
                onSwitchToRegister={() => navigate('/register')}
                onLogin={handleLogin}
              />
            }
          />
          <Route
            path="/register"
            element={
              <RegisterPage onSwitchToLogin={() => navigate('/login')} />
            }
          />
        </>
      )}

      {/* Защищённые — обёрнуты в Layout */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/claims" replace />} />
        <Route path="claims" element={<ClaimsList />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}