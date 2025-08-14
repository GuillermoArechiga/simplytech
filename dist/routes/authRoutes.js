"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authService_1 = require("../services/authService");
const router = express_1.default.Router();
router.post("/register", async (req, res) => {
    try {
        const user = await (0, authService_1.registerUser)(req.body);
        res.json(user);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.post("/login", async (req, res) => {
    try {
        const result = await (0, authService_1.loginUser)(req.body);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
