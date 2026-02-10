import express from "express";
import {
  createJob,
  updateJob,
  deleteJob,
  getJobs,
} from "../controller/job.controller.js";
import { authMiddleware,  isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// users
router.get("/", authMiddleware, getJobs);
// Admin only
router.post("/", authMiddleware, isAdmin, createJob);
router.put("/:id", authMiddleware, isAdmin, updateJob);
router.delete("/:id", authMiddleware, isAdmin, deleteJob);

export default router;
