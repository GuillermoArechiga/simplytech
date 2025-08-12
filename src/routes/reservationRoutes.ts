import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { reservationSchema } from '../schemas/reservationSchemas';
import { createReservation, cancelReservation } from '../services/reservationService';

const router = express.Router();

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = reservationSchema.parse(req.body);
    const reservation = await createReservation(data.eventId, req.user.id);
    res.json(reservation);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const reservationId = req.params.id;
    const result = await cancelReservation(reservationId, req.user.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;