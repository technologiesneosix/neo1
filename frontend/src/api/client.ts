import axios from 'axios';

/**
 * Axios instance for a real backend. When VITE_API_URL is not configured the
 * app runs against the local mock database (see db.ts) so the whole product —
 * public site and admin panel — works standalone.
 */
export const apiBaseUrl: string | undefined = import.meta.env.VITE_API_URL;

export const http = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('neosix.auth.token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('neosix.auth.user');
      localStorage.removeItem('neosix.auth.token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const useRemoteApi = Boolean(apiBaseUrl);

