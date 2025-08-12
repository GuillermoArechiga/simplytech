"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reservationSchema = new mongoose_1.default.Schema({
    event: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }
});
reservationSchema.index({ event: 1, user: 1 }, { unique: true });
exports.Reservation = mongoose_1.default.model('Reservation', reservationSchema);
