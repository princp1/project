import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import client from '../api/client';
import './ClaimApproval.css';

export default function ClaimApproval() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id');

  const [claim, setClaim] = useState(null);
  const [reason, setReason] = useState('');
  const [mode, setMode] = useState('approve'); // approve | reject
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    client.get(`/claims/${id}`).then(r => setClaim(r.data.data));
  }, [id]);

  const submit = async () => {
    setError(''); setLoading(true);
    try {
      if (mode === 'approve') {
        await client.post(`/claims/${id}/approve`);
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
    <div className="approval-page">
      <h1>Согласование заявки</h1>

      <div className="claim-info">
        <div><b>№</b> {claim.claimNumber}</div>
        <div><b>Дата:</b> {new Date(claim.createdAt).toLocaleString('ru-RU')}</div>
        <div><b>Инициатор:</b> {claim.initiator.fullName}
             ({claim.initiator.department})</div>
        <div><b>Контрагент:</b> {claim.contractor.name} (ИНН {claim.contractor.inn})</div>
        <div><b>Сумма:</b> {claim.amount} ₽, НДС {claim.vatRate}%</div>
        <div><b>Назначение:</b> {claim.description}</div>
      </div>

      <h3>Прикреплённые файлы</h3>
      <ul>
        {claim.attachments.map(a =>
          <li key={a.id}>
            <a href={`http://localhost:8080/api/attachments/${a.id}`}
               target="_blank" rel="noreferrer">📄 {a.filename}</a> ({a.sizeBytes} B)
          </li>)}
        {claim.attachments.length === 0 && <li>Нет файлов</li>}
      </ul>

      <div className="actions">
        <label>
          <input type="radio" name="mode" value="approve"
                 checked={mode === 'approve'} onChange={() => setMode('approve')} />
          Согласовать
        </label>
        <label>
          <input type="radio" name="mode" value="reject"
                 checked={mode === 'reject'} onChange={() => setMode('reject')} />
          Отклонить
        </label>
      </div>

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