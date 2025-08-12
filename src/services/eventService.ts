import { Event } from "../models/Events";
import { Reservation } from "../models/Reservation";
import { eventSchema } from "../schemas/eventSchemas";

export class EventService {
  static async createEvent(data: unknown, userId: string) {
    const validated = eventSchema.parse(data);
    const event = new Event({
      ...validated,
      date: new Date(validated.date),
      createdBy: userId,
    });
    await event.save();
    return event;
  }

  static async getAllEvents() {
    return Event.find().populate("createdBy", "name email");
  }

  static async getUserEvents(userId: string) {
    return Event.find({ createdBy: userId });
  }

  static async updateEvent(eventId: string, userId: string, data: unknown) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (event.createdBy.toString() !== userId)
      throw new Error("Not authorized to edit this event");

    const validated = eventSchema.partial().parse(data);

    Object.assign(event, validated);
    await event.save();
    return event;
  }

  static async deleteEvent(eventId: string, userId: string) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (event.createdBy.toString() !== userId)
      throw new Error("Not authorized to delete this event");

    await event.deleteOne();
    return { message: "Event deleted" };
  }

  static async getUserEventsWithReservations(userId: string) {
    const events = await Event.find({ createdBy: userId });

    const eventsWithReservations = await Promise.all(
      events.map(async (event) => {
        const reservations = await Reservation.find({
          event: event._id,
        }).populate("user", "name email");
        return {
          ...event.toObject(),
          reservations,
        };
      })
    );

    return eventsWithReservations;
  }
}
