import { User } from "../models/Users";

export async function getProfile(userId: string) {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");
  return user;
}

export async function updateProfile(userId: string, name: string) {
  if (!name) throw new Error("Name is required");

  const user = await User.findByIdAndUpdate(
    userId,
    { name },
    { new: true }
  ).select("-password");

  if (!user) throw new Error("User not found");
  return user;
}