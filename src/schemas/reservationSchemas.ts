import { z } from "zod";

export const reservationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
});
