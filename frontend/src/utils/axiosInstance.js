import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/*   REQUEST INTERCEPTOR */
api.interceptors.request.use((config) => {
  // Do NOT attach token to refresh endpoint
  if (!config.url.includes("/auth/refresh")) {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* RESPONSE INTERCEPTOR */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/auth/refresh");

        const { setAuth, user } = useAuthStore.getState();
        setAuth(user, data.accessToken);

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshErr) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
