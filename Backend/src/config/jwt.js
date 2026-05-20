import jwt from "jsonwebtoken";
import { env } from "./env.js";

const JWT_SECRET = env.JWT_SECRET ;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET;

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

function verifyAccess(token) {
  return jwt.verify(token, JWT_SECRET);
}

function verifyRefresh(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

export  {
  signAccessToken,
  signRefreshToken,
  verifyAccess,
  verifyRefresh,
};