"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const Events_1 = require("../models/Events");
const Reservation_1 = require("../models/Reservation");
const eventSchemas_1 = require("../schemas/eventSchemas");
class EventService {
    static async createEvent(data, userId) {
        const validated = eventSchemas_1.eventSchema.parse(data);
        const event = new Events_1.Event({
            ...validated,
            date: new Date(validated.date),
            createdBy: userId,
        });
        await event.save();
        return event;
    }
    static async getAllEvents() {
        return Events_1.Event.find().populate("createdBy", "name email");
    }
    static async getUserEvents(userId) {
        return Events_1.Event.find({ createdBy: userId });
    }
    static async getAvailableEvents(userId) {
        const availableEvent = await Events_1.Event.find({
            currentCapacity: { $gt: 0 },
        }).populate("createdBy", "name email");
        return availableEvent;
    }
    static async updateEvent(eventId, userId, data) {
        const event = await Events_1.Event.findById(eventId);
        if (!event)
            throw new Error("Event not found");
        if (event.createdBy.toString() !== userId)
            throw new Error("Not authorized to edit this event");
        const validated = eventSchemas_1.eventSchema.partial().parse(data);
        Object.assign(event, validated);
        await event.save();
        return event;
    }
    static async deleteEvent(eventId, userId) {
        const event = await Events_1.Event.findById(eventId);
        if (!event)
            throw new Error("Event not found");
        if (event.createdBy.toString() !== userId)
            throw new Error("Not authorized to delete this event");
        await event.deleteOne();
        return { message: "Event deleted" };
    }
    static async getUserEventsWithReservations(userId) {
        const events = await Events_1.Event.find({ createdBy: userId });
        const eventsWithReservations = await Promise.all(events.map(async (event) => {
            const reservations = await Reservation_1.Reservation.find({
                event: event._id,
            }).populate("user", "name email");
            return {
                ...event.toObject(),
                reservations,
            };
        }));
        return eventsWithReservations;
    }
}
exports.EventService = EventService;
