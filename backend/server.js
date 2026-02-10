import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import cors from "cors"
import jobRoutes from "./routes/job.route.js";
import profileRoutes from "./routes/user.route.js";
import uploadRoutes from "./routes/upload.route.js";
import aiRoutes from "./routes/ai.route.js";
import applicationRoutes from "./routes/application.route.js";
import { ENV_VARS } from "./config/envVars.js";

const app = express();


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


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
connectDB();
