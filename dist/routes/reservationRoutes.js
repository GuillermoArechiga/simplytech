"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const reservationSchemas_1 = require("../schemas/reservationSchemas");
const reservationService_1 = require("../services/reservationService");
const router = express_1.default.Router();
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const data = reservationSchemas_1.reservationSchema.parse(req.body);
        const reservation = await (0, reservationService_1.createReservation)(data.eventId, req.user.id);
        res.json(reservation);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.delete('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const reservationId = req.params.id;
        const result = await (0, reservationService_1.cancelReservation)(reservationId, req.user.id);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
