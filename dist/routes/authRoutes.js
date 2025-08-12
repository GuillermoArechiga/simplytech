"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = require("../models/Users");
const authSchemas_1 = require("../schemas/authSchemas");
const router = express_1.default.Router();
router.post('/register', async (req, res) => {
    try {
        const data = authSchemas_1.registerSchema.parse(req.body);
        const hashed = await bcryptjs_1.default.hash(data.password, 10);
        const user = new Users_1.User({ ...data, password: hashed });
        await user.save();
        res.json(user);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const data = authSchemas_1.loginSchema.parse(req.body);
        const user = await Users_1.User.findOne({ email: data.email });
        if (!user)
            return res.status(400).json({ error: 'Invalid credentials' });
        const match = await bcryptjs_1.default.compare(data.password, user.password);
        if (!match)
            return res.status(400).json({ error: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
        res.json({ token });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
