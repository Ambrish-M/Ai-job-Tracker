import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import jobRoutes from "./routes/job.route.js";
import profileRoutes from "./routes/user.route.js";
import uploadRoutes from "./routes/upload.route.js";
import aiRoutes from "./routes/ai.route.js";
import applicationRoutes from "./routes/application.route.js";
import { ENV_VARS } from "./config/envVars.js";

const app = express();
const __dirname = path.resolve();

// CORS
app.use(
  cors({
    origin: ENV_VARS.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/applications", applicationRoutes);

const PORT = ENV_VARS.PORT || 5000;

//Deployment
 if(process.env.NODE_ENV ==="production"){
 // Serve static frontend files first
app.use(express.static(path.join(__dirname, "frontend/dist")));

// For all other routes not starting with /api, send index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
  }
});

 }

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
connectDB();
