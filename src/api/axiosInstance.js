import axios from 'axios';

export const BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

const instance = axios.create({ baseURL: BASE_URL });

instance.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;
  const token = localStorage.getItem('token');
  if (token) config.headers.token = token;
  return config;
});

export default instance;