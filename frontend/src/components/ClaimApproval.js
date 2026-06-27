import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ClaimApproval.css';

// Моковые данные заявок
const claims = [
  {
    id: '№12345678',
    createdAt: '21.06.2026 18:03',
    user: 'Абдулфазыров И. А.',
    department: 'Маркетинг',
    contractorId: 1,
    contractorName: 'ООО "Маркет"',
    amount: 15000.00,
    vatRate: 20,
    description: 'Оплата за рекламные материалы для кампании Q3',
    files: [{ name: 'Счёт_на_оплату.pdf', size: 237 }],
    status: 'ON_AGREE'
  },
  {
    id: '№58427897',
    createdAt: '20.06.2026 10:05',
    user: 'Смирнова Е. К.',
    department: 'Канцелярия',
    contractorId: 2,
    contractorName: 'ООО "Плюс"',
    amount: 432000.00,
    vatRate: 20,
    description: 'Закупка офисной мебели для нового отдела',
    files: [{ name: 'Коммерческое_предложение.pdf', size: 1240 }],
    status: 'ON_AGREE'
  },
];

function formatMoney(n) {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function ClaimApproval() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Находим заявку по ID (в реальном приложении — запрос к API)
  const claim = claims.find(c => c.id === `№${id}`) || claims[0];

  const handleApprove = async () => {
    setLoading(true);
    try {
      // TODO: запрос к бэку
      await new Promise(resolve => setTimeout(resolve, 500));
      alert(`Заявка ${claim.id} одобрена!`);
      navigate('/claims');
    } catch (err) {
      alert('Ошибка при одобрении заявки');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      alert('Укажите причину отклонения');
      return;
    }

    setLoading(true);
    try {
      // TODO: запрос к бэку
      await new Promise(resolve => setTimeout(resolve, 500));
      alert(`Заявка ${claim.id} отклонена`);
      navigate('/claims');
    } catch (err) {
      alert('Ошибка при отклонении заявки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="approval-page">
      <div className="approval-card">
        {/* Шапка */}
        <div className="approval-card__header">
          <h1 className="approval-card__title">Согласование заявки</h1>
          {user && (
            <div className="user-badge">
              <span className="user-badge__name">{user.fullName}</span>
              <span className="user-badge__role">{roleLabel(user.role)}</span>
            </div>
          )}
        </div>

        <div className="approval-content">
          {/* Левая колонка — информация о заявке */}
          <div className="approval-info">
            <h3 className="approval-info__title">Информация о заявке</h3>

            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">№ Заявки</span>
                <span className="info-value">{claim.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Дата создания</span>
                <span className="info-value">{claim.createdAt}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Пользователь</span>
                <span className="info-value">{claim.user}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Подразделение</span>
                <span className="info-value">{claim.department}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Контрагент</span>
                <span className="info-value">{claim.contractorName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Сумма</span>
                <span className="info-value info-value--highlight">
                  {formatMoney(claim.amount)} ₽
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Ставка НДС</span>
                <span className="info-value">{claim.vatRate}%</span>
              </div>
              <div className="info-row info-row--full">
                <span className="info-label">Описание</span>
                <span className="info-value">{claim.description}</span>
              </div>
            </div>
          </div>

          {/* Правая колонка — файлы, комментарий, кнопки */}
          <div className="approval-actions">
            {/* Прикреплённые файлы */}
            <div className="files-section">
              <h3 className="files-section__title">Прикреплённые файлы</h3>
              {claim.files && claim.files.length > 0 ? (
                <div className="files-list">
                  {claim.files.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-icon">📄</span>
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="files-empty">Нет прикреплённых файлов</p>
              )}
            </div>

            {/* Комментарий */}
            <div className="comment-section">
              <h3 className="comment-section__title">Комментарий</h3>
              <textarea
                className="comment-input"
                placeholder="Введите комментарий к заявке..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
              />
            </div>

            {/* Кнопки действий */}
            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={handleApprove}
                disabled={loading}
              >
                ✓ Одобрить
              </button>
              <button
                className="btn btn-danger"
                onClick={handleReject}
                disabled={loading}
              >
                ✗ Отклонить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function roleLabel(role) {
  const map = {
    USER: 'Пользователь',
    DIRECTOR: 'Директор',
    FIN_MANAGER: 'Фин. менеджер',
  };
  return map[role] || role;
}