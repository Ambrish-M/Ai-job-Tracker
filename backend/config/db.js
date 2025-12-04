import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

const connectDB = async () => {
  try {
    await mongoose.connect(ENV_VARS.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
export default connectDB;
