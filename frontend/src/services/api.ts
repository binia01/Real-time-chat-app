import axios from 'axios';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000';

export const api = axios.create({ baseURL: API_URL });

export const signup = (username: string, email: string, password: string) =>
  api.post('/auth/signup', { username, email, password });

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });
