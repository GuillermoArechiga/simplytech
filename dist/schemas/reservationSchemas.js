"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationSchema = void 0;
const zod_1 = require("zod");
exports.reservationSchema = zod_1.z.object({
    eventId: zod_1.z.string().min(1, "Event ID is required"),
});
