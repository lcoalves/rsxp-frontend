import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://172.16.3.26:3333'
      : 'https://dashboard-eventos-backend.herokuapp.com',
  timeout: 20000,
});

api.interceptors.request.use(async config => {
  const token = await localStorage.getItem('@dashboard/token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
