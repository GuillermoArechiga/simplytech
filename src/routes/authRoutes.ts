import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/Users';
import { registerSchema, loginSchema } from '../schemas/authSchemas';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const hashed = await bcrypt.hash(data.password, 10);
    const user = new User({ ...data, password: hashed });
    await user.save();
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!);
    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;