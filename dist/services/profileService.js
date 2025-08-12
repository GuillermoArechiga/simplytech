"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
const Users_1 = require("../models/Users");
async function getProfile(userId) {
    const user = await Users_1.User.findById(userId).select("-password");
    if (!user)
        throw new Error("User not found");
    return user;
}
async function updateProfile(userId, name) {
    if (!name)
        throw new Error("Name is required");
    const user = await Users_1.User.findByIdAndUpdate(userId, { name }, { new: true }).select("-password");
    if (!user)
        throw new Error("User not found");
    return user;
}
