import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db';
import { User } from './models/Users';
import { Event } from './models/Events';
import { Reservation } from './models/Reservation';

dotenv.config();

const randomIntBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Event.deleteMany({});
    await Reservation.deleteMany({});

    const users = [];
    for (let i = 1; i <= 5; i++) {
      const hashed = await bcrypt.hash(`password${i}`, 10);
      const user = await User.create({
        name: `User ${i}`,
        email: `user${i}@test.com`,
        password: hashed,
      });
      users.push(user);
    }

    const events = [];
    const now = Date.now();

    for (let i = 0; i < users.length; i++) {
      const eventCount = randomIntBetween(2, 6);
      for (let j = 1; j <= eventCount; j++) {
        const totalCapacity = 5;
        const event = await Event.create({
          name: `Event ${j} by User ${i + 1}`,
          date: new Date(now + 86400000 * (10 + j + i * 6)),
          location: `City ${i + 1}`,
          totalCapacity,
          currentCapacity: totalCapacity,
          createdBy: users[i]._id,
        });
        events.push(event);
      }
    }

    for (const user of users) {
      for (const event of events) {
        if (event.createdBy.toString() === user._id.toString()) continue;

        if (event.currentCapacity > 0) {
          await Reservation.create({
            event: event._id,
            user: user._id,
          });
          event.currentCapacity -= 1;
          await event.save();
        }
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();