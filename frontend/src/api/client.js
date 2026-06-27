import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('treasury_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('treasury_token');
      localStorage.removeItem('treasury_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default client;