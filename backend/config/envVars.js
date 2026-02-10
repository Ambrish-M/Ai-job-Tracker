import dotenv from "dotenv";
dotenv.config();

export const ENV_VARS = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
   ADMIN_SECRET: process.env.ADMIN_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

};
