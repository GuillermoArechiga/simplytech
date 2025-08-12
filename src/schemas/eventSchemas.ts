import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(2),
  date: z.string().refine((val) => new Date(val) > new Date(), {
    message: 'Date must be in the future',
  }),
  location: z.string().min(2),
  totalCapacity: z.number().min(1),
});