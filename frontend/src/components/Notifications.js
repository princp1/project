import React, { useEffect, useState } from 'react';
import client from '../api/client';
import './Notifications.css';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const load = () =>
    client.get('/notifications').then(r => setItems(r.data.data || []));
  useEffect(load, []);

  const read = async (id) => {
    await client.post(`/notifications/${id}/read`);
    load();
  };
  const readAll = async () => {
    await client.post('/notifications/read-all');
    load();
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>Уведомления</h1>
        <button onClick={readAll}>Прочитать все</button>
      </div>
      {items.length === 0 && <p>Нет уведомлений</p>}
      <ul>
        {items.map(n =>
          <li key={n.id} className={n.isRead ? 'read' : 'unread'}>
            <span>{n.message}</span>
            <small>{new Date(n.createdAt).toLocaleString('ru-RU')}</small>
            {!n.isRead && <button onClick={() => read(n.id)}>Прочитано</button>}
          </li>)}
      </ul>
    </div>
  );
}