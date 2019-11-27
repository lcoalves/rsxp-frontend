import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rsxp-backend.herokuapp.com',
});

export default api;
