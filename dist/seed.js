"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("./config/db");
const Users_1 = require("./models/Users");
const Events_1 = require("./models/Events");
const Reservation_1 = require("./models/Reservation");
dotenv_1.default.config();
const randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const seed = async () => {
    try {
        await (0, db_1.connectDB)();
        await Users_1.User.deleteMany({});
        await Events_1.Event.deleteMany({});
        await Reservation_1.Reservation.deleteMany({});
        const users = [];
        for (let i = 1; i <= 5; i++) {
            const hashed = await bcryptjs_1.default.hash(`password${i}`, 10);
            const user = await Users_1.User.create({
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
                const event = await Events_1.Event.create({
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
                if (event.createdBy.toString() === user._id.toString())
                    continue;
                if (event.currentCapacity > 0) {
                    await Reservation_1.Reservation.create({
                        event: event._id,
                        user: user._id,
                    });
                    event.currentCapacity -= 1;
                    await event.save();
                }
            }
        }
        process.exit(0);
    }
    catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};
seed();
