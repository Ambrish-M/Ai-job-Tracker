import { create } from "zustand";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";

const useUploadStore = create((set, get) => ({
  resume: null,
  loading: false,

  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    set({ loading: true });

    try {
      // Delete old resume if exists
      const existing = get().resume;
      if (existing?.publicId) {
        await api.delete(`/uploads/${encodeURIComponent(existing.publicId)}`);
      }

      const res = await api.post("/uploads/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploaded = {
        url: res.data.url,
        publicId: res.data.publicId,
        originalName: res.data.originalName,
      };

      set({ resume: uploaded });
      return uploaded;

    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      throw err;

    } finally {
      set({ loading: false });
    }
  },

  deleteFile: async (publicId) => {
    try {
      await api.delete(`/uploads/${encodeURIComponent(publicId)}`);
      set({ resume: null });
    } catch (err) {
      toast.error("Failed to delete file");
    }
  },

  resetUpload: () => set({ resume: null, loading: false }),
}));

export default useUploadStore;
