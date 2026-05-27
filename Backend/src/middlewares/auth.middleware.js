import { verifyAccess } from "../config/jwt.js";

function authMiddleware(req, res, next) {
  try {
    console.log("=== AUTH DEBUG ===");
    console.log("cookies:", req.cookies);
    console.log("authorization header:", req.headers.authorization);
    console.log("origin:", req.headers.origin);
    console.log("=================");

    const token = req.cookies.accessToken 
      ?? req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = verifyAccess(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export default authMiddleware;