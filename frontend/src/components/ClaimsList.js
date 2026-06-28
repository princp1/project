import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import './ClaimsList.css';

const STATUS_RU = {
  DRAFT: 'Черновик',
  PENDING_APPROVAL: 'На согласовании',
  PENDING_PAYMENT: 'К оплате',
  APPROVED: 'Согласована',
  PAID: 'Оплачена',
  REJECTED: 'Отклонена',
};

const fmt = n => new Intl.NumberFormat('ru-RU',
  { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function ClaimsList() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const load = () => {
    client.get('/claims').then(r => setClaims(r.data.data || []));
  };
  useEffect(load, []);

  const filtered = claims.filter(c =>
    !search.trim() ||
    c.claimNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.contractor.name.toLowerCase().includes(search.toLowerCase()));

  const onRowClick = c => {
    if (c.status === 'PENDING_APPROVAL' && user.role === 'DIRECTOR')
      navigate(`/claims/approval?id=${c.id}`);
    else if (c.status === 'PENDING_PAYMENT' && user.role === 'FIN_MANAGER')
      navigate(`/claims/payment?id=${c.id}`);
  };

  return (
    <div className="claims-page">
      <div className="page-header">
        <h1>{user.role === 'USER' ? 'Мои заявки' : 'Все заявки'}</h1>
        {user.role === 'USER' &&
          <button onClick={() => navigate('/claims/create')}>+ Создать</button>}
      </div>
      <input placeholder="Поиск по № или контрагенту..."
             value={search} onChange={e => setSearch(e.target.value)} />

      {filtered.length === 0 ? <p>Ничего не найдено</p> : (
        <table className="claims-table">
          <thead>
            <tr>
              <th>№</th><th>Дата</th><th>Инициатор</th>
              <th>Контрагент</th><th>Сумма</th><th>НДС</th><th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} onClick={() => onRowClick(c)}
                  className={onRowClick(c) ? 'clickable-row' : ''}>
                <td>{c.claimNumber}</td>
                <td>{new Date(c.createdAt).toLocaleString('ru-RU')}</td>
                <td>{c.initiator.fullName}<br/>
                    <small>{c.initiator.department}</small></td>
                <td>{c.contractor.name}</td>
                <td>{fmt(c.amount)} ₽</td>
                <td>{c.vatRate}%</td>
                <td>{STATUS_RU[c.status] || c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}