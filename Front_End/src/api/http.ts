/**
 * Centralized HTTP client.
 * - Attaches the JWT to every request
 * - Attempts a token refresh on 401 (infinite-loop safe)
 * - On refresh failure, clears session and routes to the real login page
 */
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export const LOGIN_PATH = "/sign-in";

let isRedirecting = false;

function forceLogout(message = "Session expired. Please log in again."): void {
  if (isRedirecting) return;
  isRedirecting = true;
  localStorage.clear();
  window.dispatchEvent(new Event("storageUpdate"));
  if (typeof window !== "undefined") {
    window.location.href = LOGIN_PATH;
  }
  // Notify any open UI toasts
  if (message) {
    window.dispatchEvent(new CustomEvent("session-expired", { detail: message }));
  }
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("tokenExpiresAt");

  if (expiresAt && Number(expiresAt) < Date.now()) {
    forceLogout();
    return Promise.reject(new axios.Cancel("Token expired"));
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error?.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/refresh-token`, {
          withCredentials: true,
        });
        const newToken = res.data.token;
        const decoded = (() => {
          try {
            const base64 = newToken.split(".")[1];
            return JSON.parse(atob(base64));
          } catch {
            return null;
          }
        })();
        localStorage.setItem("token", newToken);
        if (decoded?.exp) {
          localStorage.setItem("tokenExpiresAt", String(decoded.exp * 1000));
        }
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        forceLogout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;