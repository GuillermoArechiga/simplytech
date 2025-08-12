import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

reservationSchema.index({ event: 1, user: 1 }, { unique: true });

export const Reservation = mongoose.model('Reservation', reservationSchema);