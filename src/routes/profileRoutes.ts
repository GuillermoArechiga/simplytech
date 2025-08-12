import express from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { getProfile, updateProfile } from "../services/profileService";

const router = express.Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await getProfile(req.user.id);
    res.json(user);
  } catch (err: any) {
    res.status(err.message === "User not found" ? 404 : 500).json({ error: err.message });
  }
});

router.put("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;
    const user = await updateProfile(req.user.id, name);
    res.json(user);
  } catch (err: any) {
    if (err.message === "Name is required") return res.status(400).json({ error: err.message });
    res.status(err.message === "User not found" ? 404 : 500).json({ error: err.message });
  }
});

export default router;