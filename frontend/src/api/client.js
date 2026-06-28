import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Перехватчик запросов - добавляет токен
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('treasury_token');
    // Не добавляем токен для публичных эндпоинтов
    const publicEndpoints = ['/auth/login', '/auth/register'];
    const isPublic = publicEndpoints.some(endpoint => config.url.includes(endpoint));

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Перехватчик ответов - обрабатывает ошибки
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если ошибка 403 и мы на странице логина/регистрации - игнорируем
    const isAuthPage = window.location.pathname === '/login' ||
                       window.location.pathname === '/register';
    if (error.response?.status === 403 && isAuthPage) {
      return Promise.reject(error);
    }
    // Если 401 - токен просрочен, выходим
    if (error.response?.status === 401) {
      localStorage.removeItem('treasury_token');
      localStorage.removeItem('treasury_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;