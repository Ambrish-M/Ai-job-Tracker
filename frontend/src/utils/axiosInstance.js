import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL:
    import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",

  withCredentials: true, // allows refresh token cookie
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // If access token expired, try refresh
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        // Update store and retry original request
        const { setAuth } = useAuthStore.getState();
        setAuth(useAuthStore.getState().user, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh token failed:", refreshErr);
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;
