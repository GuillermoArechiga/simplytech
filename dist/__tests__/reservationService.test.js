"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reservationService_1 = require("../services/reservationService");
const Users_1 = require("../models/Users");
const Events_1 = require("../models/Events");
const Reservation_1 = require("../models/Reservation");
beforeAll(async () => {
    await mongoose_1.default.connect(process.env.MONGO_URI_TEST);
});
afterAll(async () => {
    await mongoose_1.default.connection.db.dropDatabase();
    await mongoose_1.default.connection.close();
});
describe("Reservation Service", () => {
    let user;
    let event;
    beforeEach(async () => {
        await Users_1.User.deleteMany({});
        await Events_1.Event.deleteMany({});
        await Reservation_1.Reservation.deleteMany({});
        user = await Users_1.User.create({
            name: "Test User",
            email: "test@example.com",
            password: "hashedpassword",
        });
        event = await Events_1.Event.create({
            name: "Test Event",
            date: new Date(Date.now() + 86400000),
            location: "Test Location",
            totalCapacity: 2, // <-- updated here
            currentCapacity: 2, // <-- updated here
            createdBy: user._id,
        });
    });
    test("createReservation reserve a spot if available", async () => {
        const reservation = await (0, reservationService_1.createReservation)(event._id.toString(), user._id.toString());
        expect(reservation).toBeDefined();
        expect(reservation.event.toString()).toBe(event._id.toString());
        const updatedEvent = await Events_1.Event.findById(event._id);
        expect(updatedEvent.currentCapacity).toBe(event.currentCapacity - 1);
    });
    test("createReservation not allow double reservation", async () => {
        await (0, reservationService_1.createReservation)(event._id.toString(), user._id.toString());
        await expect((0, reservationService_1.createReservation)(event._id.toString(), user._id.toString())).rejects.toThrow("You already have a reservation for this event");
    });
    test("cancelReservation allow owner to cancel", async () => {
        const reservation = await (0, reservationService_1.createReservation)(event._id.toString(), user._id.toString());
        const result = await (0, reservationService_1.cancelReservation)(reservation._id.toString(), user._id.toString());
        expect(result.message).toBe("Reservation cancelled");
        const updatedEvent = await Events_1.Event.findById(event._id);
        expect(updatedEvent.currentCapacity).toBe(event.currentCapacity);
    });
    test("cancelReservation reject non-owner cancellation", async () => {
        const reservation = await (0, reservationService_1.createReservation)(event._id.toString(), user._id.toString());
        const fakeUserId = new mongoose_1.default.Types.ObjectId().toString();
        await expect((0, reservationService_1.cancelReservation)(reservation._id.toString(), fakeUserId)).rejects.toThrow("Not authorized to cancel this reservation");
    });
});
