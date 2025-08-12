"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventSchema = void 0;
const zod_1 = require("zod");
exports.eventSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    date: zod_1.z.string().refine((val) => new Date(val) > new Date(), {
        message: 'Date must be in the future',
    }),
    location: zod_1.z.string().min(2),
    totalCapacity: zod_1.z.number().min(1),
});
