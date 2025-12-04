import { create } from "zustand";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";

const useJobStore = create((set, get) => ({
  jobs: [],
  loading: false,

  fetchJobs: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/jobs");
      set({ jobs: res.data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  addJob: async (jobData, onSuccess) => {
    set({ loading: true });
    try {
      await api.post("/jobs", jobData);

      toast.success("Job added successfully");
      // refresh list
      await get().fetchJobs();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Failed to add job");
    } finally {
      set({ loading: false });
    }
  },
  updateJob: async (id, updatedData, onSuccess) => {
    try {
      await api.put(`/jobs/${id}`, updatedData);
      set((state) => ({
        jobs: state.jobs.map((job) =>
          job._id === id ? { ...job, ...updatedData } : job
        ),
      }));
      toast.success("Job updated successfully");
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Failed to update job");
    }
  },

  deleteJob: async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((job) => job._id !== id),
      }));
      toast.success("Job deleted");
    } catch {
      toast.error("Failed to delete job");
    }
  },
}));

export default useJobStore;
