import express from "express";
import {
  upload,
  uploadFile,
  deleteFile,
} from "../controller/upload.controller.js";

const router = express.Router();

router.post("/resume", upload, uploadFile); 
router.delete("/:publicId", deleteFile); 

export default router;
