import express from "express";
import { eventSchema } from "../schemas/eventSchemas";
import { EventService } from '../services/eventService';
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const event = await EventService.createEvent(req.body, req.user.id);
    res.json(event);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const events = await EventService.getAllEvents();
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/mine", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const events = await EventService.getUserEventsWithReservations(req.user.id);
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/edit", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const event = await EventService.updateEvent(req.params.id, req.user.id, req.body);
    res.json(event);
  } catch (err: any) {
    if (err.message === "Event not found") return res.status(404).json({ error: err.message });
    if (err.message === "Not authorized to edit this event") return res.status(403).json({ error: err.message });
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await EventService.deleteEvent(req.params.id, req.user.id);
    res.json(result);
  } catch (err: any) {
    if (err.message === "Event not found") return res.status(404).json({ error: err.message });
    if (err.message === "Not authorized to delete this event") return res.status(403).json({ error: err.message });
    res.status(500).json({ error: "Server error" });
  }
});

export default router;