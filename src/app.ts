import express from 'express';
import dotenv from 'dotenv';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import eventRoutes from './routes/eventRoutes';
import reservationRoutes from './routes/reservationRoutes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(mongoSanitize());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/events', eventRoutes);
app.use('/reservations', reservationRoutes);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server Running`);
});