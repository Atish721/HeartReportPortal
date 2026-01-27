import express from "express";
import crypto from "crypto";
import Admin from "../models/Admin.js";
import { signToken } from "../utils/jwt.js";
import { ENV } from "../config/env.js";

const router = express.Router();

// One-time admin seed (auto)
router.post("/seed", async () => {
  const hash = crypto.createHash("sha256").update(ENV.ADMIN_PASSWORD).digest("hex");
  await Admin.deleteMany({});
  await Admin.create({ email: ENV.ADMIN_EMAIL, passwordHash: hash });
  return { success: true };
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const hash = crypto.createHash("sha256").update(password).digest("hex");
  if (hash !== admin.passwordHash)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ email });
  res.json({ success: true, token });
});

export default router;
