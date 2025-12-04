import { create } from "zustand";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";

const useAiStore = create((set) => ({
  loading: false,
  coverLetter: "",
  highlights: [],
  resumeFeedback: "",
  interviewQuestions: [],

  //  Generate Cover Letter
  generateCoverLetter: async (data) => {
    try {
      set({ loading: true });
      const res = await api.post("/ai/cover-letter", data);
      set({
        coverLetter: res.data.coverLetter || "",
        highlights: res.data.highlights || [],
        loading: false,
      });
      toast.success("Cover letter generated!");
    } catch (err) {
      set({ loading: false });
      toast.error(
        err.response?.data?.message || "Failed to generate cover letter"
      );
    }
  },

  //  Get Resume Feedback
  getResumeFeedback: async (data) => {
    try {
      set({ loading: true });
      const res = await api.post("/ai/resume-feedback", data);
      set({
        resumeFeedback: res.data.feedback || "",
        loading: false,
      });
      toast.success("Resume feedback ready!");
    } catch (err) {
      set({ loading: false });
      toast.error(
        err.response?.data?.message || "Failed to get resume feedback"
      );
    }
  },

  //  Get Interview Questions
  getInterviewQuestions: async (data) => {
    try {
      set({ loading: true });
      const res = await api.post("/ai/interview-questions", data);
      set({
        interviewQuestions: res.data.questions || [],
        loading: false,
      });
      toast.success("Interview questions generated!");
    } catch (err) {
      set({ loading: false });
      toast.error(
        err.response?.data?.message || "Failed to get interview questions"
      );
    }
  },

  resetAiState: () =>
    set({
      coverLetter: "",
      highlights: [],
      resumeFeedback: "",
      interviewQuestions: [],
    }),
}));

export default useAiStore;
