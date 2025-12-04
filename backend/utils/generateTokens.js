import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";
//  Helper: Generate tokens
export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    ENV_VARS.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign({ id: user._id }, ENV_VARS.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
