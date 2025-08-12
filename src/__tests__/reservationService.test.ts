import mongoose from "mongoose";
import {
  createReservation,
  cancelReservation,
} from "../services/reservationService";
import { User } from "../models/Users";
import { Event } from "../models/Events";
import { Reservation } from "../models/Reservation";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST!);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Reservation Service", () => {
  let user: any;
  let event: any;

  beforeEach(async () => {
    await User.deleteMany({});
    await Event.deleteMany({});
    await Reservation.deleteMany({});

    user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
    });
    event = await Event.create({
      name: "Test Event",
      date: new Date(Date.now() + 86400000),
      location: "Test Location",
      totalCapacity: 2, // <-- updated here
      currentCapacity: 2, // <-- updated here
      createdBy: user._id,
    });
  });

  test("createReservation reserve a spot if available", async () => {
    const reservation = await createReservation(
      event._id.toString(),
      user._id.toString()
    );
    expect(reservation).toBeDefined();
    expect(reservation.event.toString()).toBe(event._id.toString());

    const updatedEvent = await Event.findById(event._id);
    expect(updatedEvent!.currentCapacity).toBe(event.currentCapacity - 1);
  });

  test("createReservation not allow double reservation", async () => {
    await createReservation(event._id.toString(), user._id.toString());
    await expect(
      createReservation(event._id.toString(), user._id.toString())
    ).rejects.toThrow("You already have a reservation for this event");
  });

  test("cancelReservation allow owner to cancel", async () => {
    const reservation = await createReservation(
      event._id.toString(),
      user._id.toString()
    );
    const result = await cancelReservation(
      reservation._id.toString(),
      user._id.toString()
    );
    expect(result.message).toBe("Reservation cancelled");

    const updatedEvent = await Event.findById(event._id);
    expect(updatedEvent!.currentCapacity).toBe(event.currentCapacity);
  });

  test("cancelReservation reject non-owner cancellation", async () => {
    const reservation = await createReservation(
      event._id.toString(),
      user._id.toString()
    );
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    await expect(
      cancelReservation(reservation._id.toString(), fakeUserId)
    ).rejects.toThrow("Not authorized to cancel this reservation");
  });
});
