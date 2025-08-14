import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/Users";
import { registerSchema, loginSchema } from "../schemas/authSchemas";

export async function registerUser(userData: any) {
  const data = registerSchema.parse(userData);

  const hashed = await bcrypt.hash(data.password, 10);

  const user = new User({ ...data, password: hashed });
  await user.save();

  return user;
}

export async function loginUser(credentials: any) {
  const data = loginSchema.parse(credentials);

  const user = await User.findOne({ email: data.email });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET!
  );

  return { token };
}