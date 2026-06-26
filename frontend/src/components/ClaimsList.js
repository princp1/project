import React, { useState } from 'react';
import './ClaimsList.css';

const contractors = [

  { id: 1, name: 'ООО "Маркет"' },
  { id: 2, name: 'ООО "Плюс"' },
  { id: 3, name: 'ООО "Графика"' },
  { id: 4, name: 'ОАО "Салют"' },
];

const claims = [
  { id: '№12345678', createdAt: '21.06.2026 18:03', contractorId: 1, amount: 15000.00, status: 'ON_AGREE' },
  { id: '№58427897', createdAt: '20.06.2026 10:05', contractorId: 2, amount: 432000.00, status: 'ON_AGREE' },
  { id: '№15686432', createdAt: '18.06.2026 15:36', contractorId: 3, amount: 8000.00, status: 'APPROVED' },
  { id: '№15678634', createdAt: '17.06.2026 14:55', contractorId: 4, amount: 8500.00, status: 'REJECTED' },
];

const statusLabels = {
  NEW: 'Новая',
  ON_AGREE: 'На согласовании',
  APPROVED: 'Одобрена',
  PAID: 'Оплачена',
  REJECTED: 'Отклонена',
};

function ClaimsList({ onLogout }) {
  const [search, setSearch] = useState('');
    // Отбираем заявки, у которых id ИЛИ имя контрагента содержит search
    const filtered = claims.filter((claim) => {
      const q = search.trim().toLowerCase();
      if (!q) return true; // пустой поиск — показываем всё

      // Находим имя контрагента по id
      const contractor = contractors.find((c) => c.id === claim.contractorId);
      const contractorName = contractor ? contractor.name : '';

      return (
        claim.id.toLowerCase().includes(q) ||
        contractorName.toLowerCase().includes(q)
      );
    });

      return (
        <div className="claims-page">
          {/* Шапка: заголовок + кнопка выхода */}
          <div className="claims-page__header">
            <h1>Мои заявки</h1>
            <button className="btn btn-secondary" onClick={onLogout}>
              Выйти
            </button>
          </div>

          {/* Поиск */}
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
                // Если после фильтрации ничего не осталось
                <tr>
                  <td colSpan={5} className="muted" style={{ textAlign: 'center', padding: 24 }}>
                    Ничего не найдено
                  </td>
                </tr>
              ) : (
                // Иначе рисуем строку для каждой заявки
                filtered.map((claim) => {
                  const contractor = contractors.find((c) => c.id === claim.contractorId);
                  return (
                    <tr key={claim.id}>
                      <td>{claim.id}</td>
                      <td>{claim.createdAt}</td>
                      <td>{contractor ? contractor.name : '—'}</td>
                      <td>{formatMoney(claim.amount)}</td>
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
    // Вспомогательная функция — форматирует число как деньги
    // 15000.5 → "15 000,50"
    function formatMoney(n) {
      return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n);
    }

    export default ClaimsList;
