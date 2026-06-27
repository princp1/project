import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CreateClaim.css';

// Моковые данные контрагентов
const contractors = [
  { id: 1, name: 'ООО "Маркет"' },
  { id: 2, name: 'ООО "Плюс"' },
  { id: 3, name: 'ООО "Графика"' },
  { id: 4, name: 'ОАО "Салют"' },
];

const vatRates = [
  { value: 0, label: 'Без НДС (0%)' },
  { value: 10, label: '10%' },
  { value: 20, label: '20%' },
];

export default function CreateClaim() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    contractorId: '',
    amount: '',
    vatRate: 20,
    description: ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.contractorId || !formData.amount || !formData.description) {
      setError('Заполните все обязательные поля');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Введите корректную сумму');
      return;
    }

    setLoading(true);
    try {
      // TODO: добавить запрос к бэку
      await new Promise(resolve => setTimeout(resolve, 500));
      alert(`Заявка создана!\nКонтрагент: ${contractors.find(c => c.id === parseInt(formData.contractorId))?.name}\nСумма: ${amount} руб.\nНДС: ${formData.vatRate}%`);
      navigate('/claims');
    } catch (err) {
      setError('Ошибка создания заявки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-claim-page">
      <div className="create-claim-card">
        {/* Шапка карточки */}
        <div className="create-claim-card__header">
          <h1 className="create-claim-card__title">Создание заявки</h1>
          {user && (
            <div className="user-badge">
              <span className="user-badge__name">{user.fullName}</span>
              <span className="user-badge__role">{user.department || 'Пользователь'}</span>
            </div>
          )}
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="create-claim-form">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="contractorId">Контрагент *</label>
              <select
                id="contractorId"
                name="contractorId"
                value={formData.contractorId}
                onChange={handleChange}
                required
              >
                <option value="">Выберите контрагента</option>
                {contractors.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="amount">Сумма *</label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="vatRate">Ставка НДС</label>
              <select
                id="vatRate"
                name="vatRate"
                value={formData.vatRate}
                onChange={handleChange}
              >
                {vatRates.map(rate => (
                  <option key={rate.value} value={rate.value}>{rate.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="description">Описание *</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Введите описание заявки"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Загрузка файлов */}
          <div className="file-upload">
            <label>Прикрепить файлы</label>
            <div className="file-upload__zone">
              <input
                type="file"
                id="fileInput"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="fileInput" className="btn btn-outline">
                Выбрать файлы
              </label>
              <p className="file-upload__hint">PDF, DOC, PNG, JPEG</p>
            </div>
            {files.length > 0 && (
              <div className="file-list">
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <span className="file-item__name">{file.name}</span>
                    <span className="file-item__size">{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      className="file-item__remove"
                      onClick={() => handleRemoveFile(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'Отправить на согласование'}
          </button>
        </form>
      </div>
    </div>
  );
}