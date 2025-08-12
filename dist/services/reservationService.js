"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReservation = createReservation;
exports.findReservationsByEvent = findReservationsByEvent;
exports.cancelReservation = cancelReservation;
const Reservation_1 = require("../models/Reservation");
const Events_1 = require("../models/Events");
async function createReservation(eventId, userId) {
    const event = await Events_1.Event.findById(eventId);
    if (!event)
        throw new Error('Event not found');
    // Check currentCapacity instead of capacity
    if (event.currentCapacity <= 0)
        throw new Error('No spots available');
    const existing = await Reservation_1.Reservation.findOne({ event: eventId, user: userId });
    if (existing)
        throw new Error('You already have a reservation for this event');
    const reservation = new Reservation_1.Reservation({ event: eventId, user: userId });
    await reservation.save();
    // Decrement currentCapacity
    event.currentCapacity -= 1;
    await event.save();
    return reservation;
}
async function findReservationsByEvent(eventId) {
    return Reservation_1.Reservation.find({ event: eventId }).populate('user', 'name email');
}
async function cancelReservation(reservationId, userId) {
    const reservation = await Reservation_1.Reservation.findById(reservationId);
    if (!reservation)
        throw new Error('Reservation not found');
    if (reservation.user.toString() !== userId)
        throw new Error('Not authorized to cancel this reservation');
    const event = await Events_1.Event.findById(reservation.event);
    if (!event)
        throw new Error('Associated event not found');
    await reservation.deleteOne();
    // Increment currentCapacity on cancellation
    event.currentCapacity += 1;
    await event.save();
    return { message: 'Reservation cancelled' };
}
