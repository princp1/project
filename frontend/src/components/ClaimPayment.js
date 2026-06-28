import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import client from '../api/client';
import './ClaimPayment.css';

export default function ClaimPayment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id');

  const [claim, setClaim] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [reason, setReason] = useState('');
  const [mode, setMode] = useState('pay');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    client.get(`/claims/${id}`).then(r => setClaim(r.data.data));
    client.get('/accounts').then(r => setAccounts(r.data.data || []));
  }, [id]);

  const selectedAcc = accounts.find(a => a.id === Number(accountId));
  const notEnough = selectedAcc && claim && selectedAcc.balance < claim.amount;

  const submit = async () => {
    setError(''); setLoading(true);
    try {
      if (mode === 'pay') {
        if (!accountId) { setError('Выберите счёт'); setLoading(false); return; }
        await client.post(`/claims/${id}/pay?accountId=${accountId}`);
      } else {
        if (!reason.trim()) { setError('Укажите причину'); setLoading(false); return; }
        await client.post(`/claims/${id}/reject?reason=${encodeURIComponent(reason)}`);
      }
      navigate('/claims');
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка');
    } finally { setLoading(false); }
  };

  if (!claim) return <p>Загрузка...</p>;

  return (
    <div className="payment-page">
      <h1>Оплата заявки</h1>
      <div className="claim-info">
        <div><b>№</b> {claim.claimNumber}</div>
        <div><b>Инициатор:</b> {claim.initiator.fullName}
             ({claim.initiator.department})</div>
        <div><b>Контрагент:</b> {claim.contractor.name}</div>
        <div><b>Сумма:</b> {claim.amount} ₽, НДС {claim.vatRate}%</div>
        <div><b>Назначение:</b> {claim.description}</div>
      </div>

      <h3>Файлы</h3>
      <ul>
        {claim.attachments.map(a =>
          <li key={a.id}>
            <a href={`http://localhost:8080/api/attachments/${a.id}`}
               target="_blank" rel="noreferrer">📄 {a.filename}</a>
          </li>)}
      </ul>

      <div className="actions">
        <label>
          <input type="radio" name="mode" value="pay"
                 checked={mode === 'pay'} onChange={() => setMode('pay')} />
          Оплатить
        </label>
        <label>
          <input type="radio" name="mode" value="reject"
                 checked={mode === 'reject'} onChange={() => setMode('reject')} />
          Отклонить
        </label>
      </div>

      {mode === 'pay' && (
        <>
          <select value={accountId} onChange={e => setAccountId(e.target.value)}>
            <option value="">Выберите счёт...</option>
            {accounts.map(a =>
              <option key={a.id} value={a.id}>
                {a.bank} — {a.accountNumber} — {a.balance} {a.currency}
              </option>)}
          </select>
          {notEnough && <div className="warn">⚠️ Недостаточно средств на счёте</div>}
        </>
      )}

      {mode === 'reject' &&
        <textarea placeholder="Причина отклонения *"
                  value={reason} onChange={e => setReason(e.target.value)} />}

      {error && <div className="error">{error}</div>}
      <button onClick={submit} disabled={loading}>
        {loading ? 'Сохранение...' : 'Подтвердить'}
      </button>
      <button onClick={() => navigate('/claims')}>Отмена</button>
    </div>
  );
}