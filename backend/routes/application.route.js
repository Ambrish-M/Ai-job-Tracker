import express from "express";
import {
  applyJob,
  getApplications,
  getMyApplications,
  markResumeViewed,
  updateStatus,
} from "../controller/application.controller.js";

import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyJob);
router.get("/my-applications", authMiddleware, getMyApplications);
router.get("/getapplications", authMiddleware, adminOnly, getApplications);
router.put("/:id/status", authMiddleware, adminOnly, updateStatus);
router.put("/:appId/viewed", authMiddleware, adminOnly, markResumeViewed);

export default router;
