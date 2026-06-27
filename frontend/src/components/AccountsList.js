import React, { useState } from 'react';
import './AccountsList.css';

// Моковые данные счетов
const accounts = [
  { id: 1, bank: 'Сбербанк', accountNumber: '40817810099910004312', balance: 1500000.00, currency: 'RUB' },
  { id: 2, bank: 'ВТБ', accountNumber: '40802810500000001234', balance: 850000.00, currency: 'RUB' },
  { id: 3, bank: 'Альфа-Банк', accountNumber: '40802910000000005678', balance: 2500000.00, currency: 'RUB' },
];

function formatMoney(n) {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export default function AccountsList() {
  const [search, setSearch] = useState('');

  const filtered = accounts.filter((acc) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      acc.bank.toLowerCase().includes(q) ||
      acc.accountNumber.includes(q)
    );
  });

  return (
    <div className="accounts-page">
      <div className="accounts-page__title-row">
        <h1 className="accounts-page__title">Счета</h1>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Поиск по банку или номеру счёта"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>№ Счёта</th>
            <th>Банк</th>
            <th>Номер счёта</th>
            <th>Баланс</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: 32, color: '#7B8794' }}>
                Ничего не найдено
              </td>
            </tr>
          ) : (
            filtered.map((account) => (
              <tr key={account.id}>
                <td>{account.id}</td>
                <td>{account.bank}</td>
                <td>{account.accountNumber}</td>
                <td>{formatMoney(account.balance)} {account.currency}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}