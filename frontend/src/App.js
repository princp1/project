import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Layout from './components/Layout';
import ClaimsList from './components/ClaimsList';
import CreateClaim from './components/CreateClaim';
import ClaimApproval from './components/ClaimApproval';
import ClaimPayment from './components/ClaimPayment';
import ContractorsList from './components/ContractorsList';
import AccountsList from './components/AccountsList';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import './App.css';

export default function App() {
  const { user } = useAuth();

  return (
    <>
      {/* Публичные маршруты — только для неавторизованных */}
      {!user && (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}

      {/* Защищённые маршруты — обёрнуты в Layout */}
      {user && (
        <Layout>
          <Routes>
            <Route path="/claims" element={<ClaimsList />} />
            <Route path="/claims/new" element={<CreateClaim />} />
            <Route path="/claims/:id/approval" element={<ClaimApproval />} />
            <Route path="/claims/:id/payment" element={<ClaimPayment />} />
            <Route path="/contractors" element={<ContractorsList />} />
            <Route path="/accounts" element={<AccountsList />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/claims" />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}