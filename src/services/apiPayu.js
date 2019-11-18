import axios from 'axios';

const apiLogin = 'CURvRFvX0Azsfn3';
const apiKey = '5yg8kzk51kC7AQmO2UYk7cLWXi';

const api = axios.create({
  baseURL: 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi',
  timeout: 20000,
});

api.interceptors.request.use(async config => {
  config.data = {
    language: 'pt',
    merchant: {
      apiLogin,
      apiKey,
    },
  };

  return config;
});

export default api;
