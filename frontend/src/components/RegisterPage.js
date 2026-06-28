import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import './RegisterPage.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '', login: '', password: '', role: 'USER', departmentId: '',
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/departments').then(r => setDepartments(r.data.data || []));
  }, []);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (form.role === 'USER' && !form.departmentId) {
      setError('Выберите подразделение');
      return;
    }
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        login: form.login,
        password: form.password,
        role: form.role,
        departmentId: form.departmentId ? Number(form.departmentId) : null,
      });
      navigate('/claims');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally { setLoading(false); }
  };

  return (
    <div className="register-container">
      <h1>Регистрация</h1>
      <form onSubmit={submit}>
        <input name="fullName" placeholder="ФИО"
               value={form.fullName} onChange={onChange} />
        <input name="login" placeholder="Логин"
               value={form.login} onChange={onChange} />
        <input name="password" type="password" placeholder="Пароль"
               value={form.password} onChange={onChange} />

        <select name="role" value={form.role} onChange={onChange}>
          <option value="USER">Пользователь</option>
          <option value="DIRECTOR">Директор</option>
          <option value="FIN_MANAGER">Фин. менеджер</option>
        </select>

        {form.role === 'USER' && (
          <select name="departmentId" value={form.departmentId} onChange={onChange}>
            <option value="">Подразделение...</option>
            {departments.map(d =>
              <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        )}

        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p>Есть аккаунт? <Link to="/login">Войти</Link></p>
    </div>
  );
}