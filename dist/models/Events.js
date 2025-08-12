"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    totalCapacity: { type: Number, required: true },
    currentCapacity: { type: Number, required: true },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
eventSchema.pre("validate", function (next) {
    if (this.isNew && this.currentCapacity === undefined) {
        this.currentCapacity = this.totalCapacity;
    }
    next();
});
exports.Event = mongoose_1.default.model("Event", eventSchema);
