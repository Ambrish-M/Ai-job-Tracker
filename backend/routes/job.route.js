import express from "express";
import {
  createJob,
  updateJob,
  deleteJob,
  getJobs,
} from "../controller/job.controller.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// users
router.get("/", authMiddleware, getJobs);
// Admin only
router.post("/", authMiddleware, adminOnly, createJob);
router.put("/:id", authMiddleware, adminOnly, updateJob);
router.delete("/:id", authMiddleware, adminOnly, deleteJob);

export default router;
