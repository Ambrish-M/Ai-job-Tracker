import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostedJob",
      required: true,
    },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
    
    },
    phone: {
      type: String,
      required: true,
      
    },

    resume: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      originalName: { type: String, required: true },
    },
    jobSnapshot: {
      role: { type: String },
      company: { type: String },
      salary: { type: String },
      experience: { type: String },
    },
    status: {
      type: String,
      enum: ["Applied", "Interview Scheduled", "Offer", "Rejected"],
      default: "Applied",
    },
    viewedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", jobApplicationSchema);
