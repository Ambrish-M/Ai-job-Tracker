import { create } from "zustand";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";

const useProfileStore = create((set, get) => ({
  profile: null,
  loadingProfile: false,
  updatingProfile: false,

  // Fetch user profile
  fetchProfile: async (force = false) => {
    const { profile } = get();
    if (profile && !force) return; 

    set({ loadingProfile: true });
    try {
      const res = await api.get("/user/profile");
      set({ profile: res.data });
    } catch (err) {
      console.error("Failed to fetch profile", err);
      toast.error(err.response?.data?.message || "Failed to load profile");
    } finally {
      set({ loadingProfile: false });
    }
  },

  // Update profile
  updateProfile: async (profileData, onSuccess) => {
    set({ updatingProfile: true });

    try {
      const res = await api.put("/user/profile", profileData);
      set({ profile: res.data });
      toast.success("Profile updated successfully");

      if (onSuccess) onSuccess(); // navigate from component
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      set({ updatingProfile: false });
    }
  },
}));

export default useProfileStore;
