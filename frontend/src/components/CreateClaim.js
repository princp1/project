import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import './CreateClaim.css';

const VAT_RATES = [
  { value: 0,  label: 'Без НДС (0%)' },
  { value: 10, label: 'НДС 10%' },
  { value: 20, label: 'НДС 20%' },
];

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export default function CreateClaim() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [contractors, setContractors] = useState([]);
  const [loadingContractors, setLoadingContractors] = useState(true);

  const [form, setForm] = useState({
    contractorId: '',
    amount: '',
    vatRate: 20,
    description: '',
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ===== Загружаем список контрагентов =====
  useEffect(() => {
    let cancelled = false;
    client.get('/contractors')
      .then(r => {
        if (cancelled) return;
        setContractors(r.data.data || []);
      })
      .catch(err => {
        if (cancelled) return;
        setError('Не удалось загрузить контрагентов: ' + (err.response?.data?.message || err.message));
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingContractors(false);
      });
    return () => { cancelled = true; };
  }, []);

  // ===== Выбранный контрагент (для отображения реквизитов) =====
  const selectedContractor = useMemo(
    () => contractors.find(c => String(c.id) === String(form.contractorId)),
    [contractors, form.contractorId]
  );

  // ===== Хэндлеры =====
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onFiles = (e) => {
    const incoming = Array.from(e.target.files);
    // Фильтр по типу/размеру на клиенте (дублируем проверку с бэка)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
    ];
    const MAX = 10 * 1024 * 1024;
    const valid = [];
    const rejected = [];
    incoming.forEach(f => {
      if (!allowedTypes.includes(f.type)) {
        rejected.push(`${f.name} — неподдерживаемый тип`);
      } else if (f.size > MAX) {
        rejected.push(`${f.name} — больше 10 МБ`);
      } else {
        valid.push(f);
      }
    });
    if (rejected.length) {
      setError('Некоторые файлы отклонены:\n' + rejected.join('\n'));
    } else {
      setError('');
    }
    setFiles(prev => [...prev, ...valid]);
    e.target.value = ''; // сбрасываем input, чтобы можно было выбрать тот же файл снова
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // ===== Валидация =====
  const validate = () => {
    if (!form.contractorId) return 'Выберите контрагента';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      return 'Сумма должна быть числом больше нуля';
    }
    if (![0, 10, 20].includes(Number(form.vatRate))) {
      return 'Ставка НДС должна быть 0, 10 или 20';
    }
    if (!form.description.trim() || form.description.trim().length < 3) {
      return 'Укажите назначение платежа (минимум 3 символа)';
    }
    return null;
  };

  // ===== Отправка =====
  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      // data — JSON-блоб, как ждёт бэк
      fd.append(
        'data',
        new Blob(
          [JSON.stringify({
            contractorId: Number(form.contractorId),
            amount: Number(form.amount),
            vatRate: Number(form.vatRate),
            description: form.description.trim(),
          })],
          { type: 'application/json' }
        )
      );
      // files — каждый файл отдельной частью
      files.forEach(f => fd.append('files', f));

      const res = await client.post('/claims', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const created = res.data.data;
      // Редиректим в список заявок — пользователь увидит свою заявку со статусом «На согласовании»
      navigate('/claims', { state: { flash: `Заявка №${created.claimNumber} создана` } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Не удалось создать заявку');
    } finally {
      setLoading(false);
    }
  };

  // ===== Защита: создавать может только USER =====
  if (user?.role !== 'USER') {
    return (
      <div className="create-claim-page">
        <div className="create-claim-card">
          <p>Создавать заявки могут только пользователи с ролью USER.</p>
          <button className="btn btn-outline" onClick={() => navigate('/claims')}>
            ← К списку заявок
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-claim-page">
      <div className="create-claim-card">
        {/* ===== Шапка ===== */}
        <div className="create-claim-card__header">
          <h2 className="create-claim-card__title">Новая заявка</h2>
          <div className="user-badge">
            <span className="user-badge__name">{user?.fullName}</span>
            <span className="user-badge__role">{user?.department?.name || 'Без подразделения'}</span>
          </div>
        </div>

        {/* ===== Форма ===== */}
        <form className="create-claim-form" onSubmit={submit}>
          <div className="form-grid">
            {/* Контрагент */}
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="contractorId">Контрагент *</label>
              <select
                id="contractorId"
                name="contractorId"
                value={form.contractorId}
                onChange={onChange}
                disabled={loadingContractors}
                required
              >
                <option value="">
                  {loadingContractors ? 'Загрузка...' : 'Выберите контрагента'}
                </option>
                {contractors.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} (ИНН {c.inn})
                  </option>
                ))}
              </select>
              {selectedContractor && (
                <small style={{ color: '#7B8794', fontSize: 12, marginTop: 4 }}>
                  {selectedContractor.fullName} • КПП {selectedContractor.kpp} •
                  р/с {selectedContractor.bankAccount}
                </small>
              )}
            </div>

            {/* Сумма */}
            <div className="field">
              <label htmlFor="amount">Сумма, ₽ *</label>
              <input
                id="amount"
                type="number"
                name="amount"
                value={form.amount}
                onChange={onChange}
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
              />
            </div>

            {/* НДС */}
            <div className="field">
              <label htmlFor="vatRate">Ставка НДС</label>
              <select
                id="vatRate"
                name="vatRate"
                value={form.vatRate}
                onChange={onChange}
              >
                {VAT_RATES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Назначение */}
          <div className="field">
            <label htmlFor="description">Назначение платежа *</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Например: оплата по договору №123 за услуги связи за май 2026"
              maxLength={500}
              required
            />
          </div>

          {/* Файлы */}
          <div className="file-upload">
            <label htmlFor="files">
              Вложения (счета, акты) — PDF, DOC, DOCX, PNG, до 10 МБ
            </label>
            <div className="file-upload__zone">
              <input
                id="files"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png"
                onChange={onFiles}
              />
              <p className="file-upload__hint">Можно выбрать несколько файлов сразу</p>
            </div>

            {files.length > 0 && (
              <ul className="file-list">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`} className="file-item">
                    <span className="file-item__name">{f.name}</span>
                    <span className="file-item__size">{formatSize(f.size)}</span>
                    <button
                      type="button"
                      className="file-item__remove"
                      onClick={() => removeFile(i)}
                      title="Удалить"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Ошибка */}
          {error && (
            <div className="error-message" style={{ whiteSpace: 'pre-line' }}>
              {error}
            </div>
          )}

          {/* Кнопки */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/claims')}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || loadingContractors}
            >
              {loading ? 'Отправка...' : 'Создать и отправить на согласование'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}