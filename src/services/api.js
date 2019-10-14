import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3333'
      : 'https://dashboard-eventos-backend.herokuapp.com',
  timeout: 10000,
});

api.interceptors.request.use(async config => {
  const token = await localStorage.getItem('@dashboard/token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
