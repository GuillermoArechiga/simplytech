import express from "express";
import { registerUser, loginUser } from "../services/authService";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;