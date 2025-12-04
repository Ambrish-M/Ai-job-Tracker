import express from "express";
import {
  getResumeFeedback,
  getInterviewQuestions,
  generateCoverLetter,
} from "../controller/ai.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected by authentication
router.post("/cover-letter", authMiddleware, generateCoverLetter);
router.post("/resume-feedback", authMiddleware, getResumeFeedback);
router.post("/interview-questions", authMiddleware, getInterviewQuestions);

export default router;
