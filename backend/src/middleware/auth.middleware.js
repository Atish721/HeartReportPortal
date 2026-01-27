import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) throw new Error("No token");

    const token = auth.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
