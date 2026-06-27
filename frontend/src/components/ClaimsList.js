import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ClaimsList.css';

// Моковые данные — потом заменить на обращение к бд
const contractors = [
  { id: 1, name: 'ООО "Маркет"' },
  { id: 2, name: 'ООО "Плюс"' },
  { id: 3, name: 'ООО "Графика"' },
  { id: 4, name: 'ОАО "Салют"' },
];

const claims = [
  { id: '12345678', createdAt: '21.06.2026 18:03', contractorId: 1, amount: 15000.00, status: 'ON_AGREE' },
  { id: '58427897', createdAt: '20.06.2026 10:05', contractorId: 2, amount: 432000.00, status: 'ON_AGREE' },
  { id: '15686432', createdAt: '18.06.2026 15:36', contractorId: 3, amount: 8000.00, status: 'APPROVED' },
  { id: '15678634', createdAt: '17.06.2026 14:55', contractorId: 4, amount: 8500.00, status: 'REJECTED' },
];

const statusLabels = {
  NEW: 'Новая',
  ON_AGREE: 'На согласовании',
  APPROVED: 'Одобрена',
  PAID: 'Оплачена',
  REJECTED: 'Отклонена',
};

function formatMoney(n) {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export default function ClaimsList() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const filtered = claims.filter((claim) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const contractor = contractors.find((c) => c.id === claim.contractorId);
    const name = contractor ? contractor.name : '';
    return (
      claim.id.toLowerCase().includes(q) ||
      name.toLowerCase().includes(q)
    );
  });

  const handleRowClick = (claim) => {
    // В зависимости от статуса и роли — разные страницы
    if (claim.status === 'ON_AGREE' && user?.role === 'DIRECTOR') {
      navigate(`/claims/${claim.id}/approval`);
    } else if (claim.status === 'APPROVED' && user?.role === 'FIN_MANAGER') {
      navigate(`/claims/${claim.id}/payment`);
    } else {
      // Просмотр заявки (пока просто alert)
      alert(`Заявка ${claim.id}\nСтатус: ${statusLabels[claim.status]}`);
    }
  };

  return (
    <div className="claims-page">
      {/* Заголовок страницы + кнопка "Создать заявку" */}
      <div className="claims-page__title-row">
        <h1 className="claims-page__title">Мои заявки</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/claims/new')}
        >
          + Создать заявку
        </button>
      </div>

      {/* Поле поиска */}
      <input
        type="text"
        className="search-input"
        placeholder="Поиск по номеру заявки"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Таблица */}
      <table className="data-table">
        <thead>
          <tr>
            <th>№ Заявки</th>
            <th>Дата создания</th>
            <th>Контрагент</th>
            <th>Сумма</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#7B8794' }}>
                Ничего не найдено
              </td>
            </tr>
          ) : (
            filtered.map((claim) => {
              const contractor = contractors.find((c) => c.id === claim.contractorId);
              return (
                <tr
                  key={claim.id}
                  onClick={() => handleRowClick(claim)}
                  className="clickable-row"
                >
                  <td>№{claim.id}</td>
                  <td>{claim.createdAt}</td>
                  <td>{contractor ? contractor.name : '—'}</td>
                  <td>{formatMoney(claim.amount)} ₽</td>
                  <td>
                    <span className={`status-badge status-${claim.status}`}>
                      {statusLabels[claim.status]}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}