import React from 'react';
import './Notifications.css';

// Моковые уведомления
const notifications = [
  { id: 1, type: 'info', title: 'Новая заявка на согласовании', message: 'Заявка №12345678 ожидает вашего решения', time: '5 минут назад', read: false },
  { id: 2, type: 'success', title: 'Заявка одобрена', message: 'Заявка №15686432 была одобрена директором', time: '2 часа назад', read: false },
  { id: 3, type: 'warning', title: 'Срок оплаты', message: 'Заявка №58427897 требует оплаты в течение 3 дней', time: '1 день назад', read: true },
  { id: 4, type: 'info', title: 'Новый контрагент', message: 'Добавлен новый контрагент ООО "Вектор"', time: '3 дня назад', read: true },
];

export default function Notifications() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="notifications-page__title-row">
        <h1 className="notifications-page__title">Уведомления</h1>
        {unreadCount > 0 && (
          <span className="notifications-badge">{unreadCount} новых</span>
        )}
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">Нет уведомлений</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? 'notification-item--read' : ''}`}
            >
              <div className={`notification-icon notification-icon--${notification.type}`}>
                {notification.type === 'success' && '✓'}
                {notification.type === 'warning' && '!'}
                {notification.type === 'info' && 'i'}
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{notification.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}