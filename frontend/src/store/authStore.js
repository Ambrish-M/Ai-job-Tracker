import { create } from "zustand";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("token") || null,
  user: null,

  // NEW: separate flags
  initializing: true, // app initial auth check
  authLoading: false, // login/register action loading

  setAuth: (user, token) => {
    if (token) localStorage.setItem("token", token);
    set({ user, token });
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      // nothing to validate; initial check done
      set({ initializing: false });
      return;
    }

    try {
      const res = await api.get("/user/profile");
      set({ user: res.data, initializing: false });
    } catch (err) {
      console.log("checkAuth error:", err);
      // Let axios interceptor handle refresh; don't clear token here
      set({ initializing: false });
    }
  },

  login: async (form, navigate) => {
    set({ authLoading: true });
    try {
      const res = await api.post("/auth/login", form);
      const { accessToken, user } = res.data;

      localStorage.setItem("token", accessToken);
      set({ token: accessToken, user, authLoading: false });

      toast.success("Logged in successfully");

      navigate(user.role === "admin" ? "/dashboard" : "/home", {
        replace: true,
      });
      return res;
    } catch (err) {
      set({ authLoading: false });
      toast.error(err.response?.data?.message || "Login failed");
    }
  },

  register: async (form, navigate) => {
    set({ authLoading: true });
    try {
      const res = await api.post("/auth/register", form);
      set({ authLoading: false });
      toast.success(res.data.message || "Registered successfully!");
      navigate("/login");
      return res;
    } catch (err) {
      set({ authLoading: false });
      toast.error(err.response?.data?.message || "Registration failed");
    }
  },

  logout: async (showToast = true) => {
    try {
      await api.post("/auth/logout").catch(() => {}); // best-effort clear server cookie
    } catch (e) {
      toast.error(e.response?.data?.message) || "Logout Failed";
    }
    localStorage.removeItem("token");
    set({ token: null, user: null });
    if (showToast) toast.success("Logged out");
  },
}));

export default useAuthStore;
