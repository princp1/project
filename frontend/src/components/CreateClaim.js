import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import './CreateClaim.css';

const vatRates = [
  { value: 0, label: 'Без НДС (0%)' },
  { value: 10, label: '10%' },
  { value: 20, label: '20%' },
];

export default function CreateClaim() {
  const navigate = useNavigate();
  const [contractors, setContractors] = useState([]);
  const [form, setForm] = useState({
    contractorId: '', amount: '', vatRate: 20, description: '',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/contractors').then(r => setContractors(r.data.data || []));
  }, []);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onFiles = e => setFiles([...files, ...Array.from(e.target.files)]);
  const removeFile = i => setFiles(files.filter((_, idx) => idx !== i));

  const size = b => b < 1024 ? b + ' B'
    : b < 1048576 ? (b / 1024).toFixed(1) + ' KB'
    : (b / 1048576).toFixed(1) + ' MB';

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (!form.contractorId || !form.amount || !form.description) {
      setError('Заполните обязательные поля'); return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('data', new Blob([JSON.stringify({
        contractorId: Number(form.contractorId),
        amount: Number(form.amount),
        vatRate: Number(form.vatRate),
        description: form.description,
      })], { type: 'application/json' }));
      files.forEach(f => fd.append('files', f));
      await client.post('/claims', fd);
      navigate('/claims');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка');
    } finally { setLoading(false); }
  };

  return (
    <div className="create-claim-container">
      <h1>Новая заявка</h1>
      <form onSubmit={submit}>
        <label>Контрагент *</label>
        <select name="contractorId" value={form.contractorId} onChange={onChange}>
          <option value="">Выберите...</option>
          {contractors.map(c =>
            <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <label>Сумма *</label>
        <input type="number" name="amount" value={form.amount} onChange={onChange} />

        <label>Ставка НДС</label>
        <select name="vatRate" value={form.vatRate} onChange={onChange}>
          {vatRates.map(r =>
            <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>

        <label>Назначение *</label>
        <textarea name="description" value={form.description} onChange={onChange} />

        <label>Счета (.pdf, .doc, .docx, .png)</label>
        <input type="file" multiple
               accept=".pdf,.doc,.docx,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png"
               onChange={onFiles} />
        <ul>
          {files.map((f, i) =>
            <li key={i}>{f.name} ({size(f.size)})
              <button type="button" onClick={() => removeFile(i)}>×</button>
            </li>)}
        </ul>

        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Отправка...' : 'Создать и отправить на согласование'}
        </button>
      </form>
    </div>
  );
}