import { Reservation } from '../models/Reservation';
import { Event } from '../models/Events';

export async function createReservation(eventId: string, userId: string) {
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Event not found');

  // Check currentCapacity instead of capacity
  if (event.currentCapacity <= 0) throw new Error('No spots available');

  const existing = await Reservation.findOne({ event: eventId, user: userId });
  if (existing) throw new Error('You already have a reservation for this event');

  const reservation = new Reservation({ event: eventId, user: userId });
  await reservation.save();

  // Decrement currentCapacity
  event.currentCapacity -= 1;
  await event.save();

  return reservation;
}

export async function findReservationsByEvent(eventId: string) {
  return Reservation.find({ event: eventId }).populate('user', 'name email');
}

export async function cancelReservation(reservationId: string, userId: string) {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) throw new Error('Reservation not found');

  if (reservation.user.toString() !== userId) throw new Error('Not authorized to cancel this reservation');

  const event = await Event.findById(reservation.event);
  if (!event) throw new Error('Associated event not found');

  await reservation.deleteOne();

  // Increment currentCapacity on cancellation
  event.currentCapacity += 1;
  await event.save();

  return { message: 'Reservation cancelled' };
}