import mongoose from "mongoose";

const postedJobSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: String,
      default: "Not disclosed",
      trim: true,
    },
    experience: {
      type: String,
      default: "Fresher",
      trim: true,
    },
    jobDescription: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PostedJob", postedJobSchema);
