"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const profileService_1 = require("../services/profileService");
const router = express_1.default.Router();
router.get("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const user = await (0, profileService_1.getProfile)(req.user.id);
        res.json(user);
    }
    catch (err) {
        res.status(err.message === "User not found" ? 404 : 500).json({ error: err.message });
    }
});
router.put("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await (0, profileService_1.updateProfile)(req.user.id, name);
        res.json(user);
    }
    catch (err) {
        if (err.message === "Name is required")
            return res.status(400).json({ error: err.message });
        res.status(err.message === "User not found" ? 404 : 500).json({ error: err.message });
    }
});
exports.default = router;
