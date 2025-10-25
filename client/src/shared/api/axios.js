import axios from 'axios';

const instance = axios.create({
  // URL de la api de backend
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
});

export default instance;