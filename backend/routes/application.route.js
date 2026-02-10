import express from "express";
import {
  applyJob,
  getApplications,
  getMyApplications,
  markResumeViewed,
  updateStatus,
} from "../controller/application.controller.js";

import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyJob);
router.get("/my-applications", authMiddleware, getMyApplications);
router.get("/getapplications", authMiddleware, isAdmin, getApplications);
router.put("/:id/status", authMiddleware, isAdmin, updateStatus);
router.put("/:appId/viewed", authMiddleware, isAdmin, markResumeViewed);

export default router;
