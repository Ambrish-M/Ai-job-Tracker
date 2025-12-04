import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);

export default router;
