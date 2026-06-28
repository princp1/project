import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import './ContractorsList.css';

const EMPTY = { name: '', fullName: '', inn: '', kpp: '',
                bankAccount: '', address: '', phone: '', email: '' };

export default function ContractorsList() {
  const { user } = useAuth();
  const canEdit = user.role === 'DIRECTOR' || user.role === 'FIN_MANAGER';

  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const load = () => {
    client.get('/contractors', { params: { search } })
      .then(r => setList(r.data.data || []));
  };
  useEffect(() => { load(); }, [search]);

  const startNew = () => { setEditing('new'); setForm(EMPTY); setError(''); };
  const startEdit = c => {
    setEditing(c.id);
    setForm({ ...EMPTY, ...c });
    setError('');
  };
  const cancel = () => { setEditing(null); setError(''); };

  const save = async () => {
    try {
      if (editing === 'new') {
        await client.post('/contractors', form);
      } else {
        await client.put(`/contractors/${editing}`, form);
      }
      setEditing(null);
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка сохранения');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Удалить контрагента?')) return;
    await client.delete(`/contractors/${id}`);
    load();
  };

  return (
    <div className="contractors-page">
      <div className="page-header">
        <h1>Контрагенты</h1>
        {canEdit && <button onClick={startNew}>+ Добавить</button>}
      </div>

      <input placeholder="Поиск по названию или ИНН..."
             value={search} onChange={e => setSearch(e.target.value)} />

      <table>
        <thead>
          <tr><th>Название</th><th>Полное название</th>
              <th>ИНН</th><th>КПП</th>{canEdit && <th></th>}</tr>
        </thead>
        <tbody>
          {list.map(c =>
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.fullName}</td>
              <td>{c.inn}</td>
              <td>{c.kpp}</td>
              {canEdit && <td>
                <button onClick={() => startEdit(c)}>✎</button>
                <button onClick={() => remove(c.id)}>×</button>
              </td>}
            </tr>)}
        </tbody>
      </table>

      {editing !== null && (
        <div className="modal">
          <h3>{editing === 'new' ? 'Новый контрагент' : 'Редактирование'}</h3>
          {['name','fullName','inn','kpp','bankAccount','address','phone','email']
            .map(f =>
              <input key={f} name={f} placeholder={f}
                     value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} />)}
          {error && <div className="error">{error}</div>}
          <button onClick={save}>Сохранить</button>
          <button onClick={cancel}>Отмена</button>
        </div>
      )}
    </div>
  );
}