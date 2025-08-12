"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventService_1 = require("../services/eventService");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const event = await eventService_1.EventService.createEvent(req.body, req.user.id);
        res.json(event);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.get("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const events = await eventService_1.EventService.getAllEvents();
        res.json(events);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/mine", auth_1.authMiddleware, async (req, res) => {
    try {
        const events = await eventService_1.EventService.getUserEventsWithReservations(req.user.id);
        res.json(events);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put("/:id/edit", auth_1.authMiddleware, async (req, res) => {
    try {
        const event = await eventService_1.EventService.updateEvent(req.params.id, req.user.id, req.body);
        res.json(event);
    }
    catch (err) {
        if (err.message === "Event not found")
            return res.status(404).json({ error: err.message });
        if (err.message === "Not authorized to edit this event")
            return res.status(403).json({ error: err.message });
        res.status(400).json({ error: err.message });
    }
});
router.delete("/:id", auth_1.authMiddleware, async (req, res) => {
    try {
        const result = await eventService_1.EventService.deleteEvent(req.params.id, req.user.id);
        res.json(result);
    }
    catch (err) {
        if (err.message === "Event not found")
            return res.status(404).json({ error: err.message });
        if (err.message === "Not authorized to delete this event")
            return res.status(403).json({ error: err.message });
        res.status(500).json({ error: "Server error" });
    }
});
exports.default = router;
