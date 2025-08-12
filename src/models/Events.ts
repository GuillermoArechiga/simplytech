import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  totalCapacity: { type: Number, required: true },
  currentCapacity: { type: Number, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
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

export const Event = mongoose.model("Event", eventSchema);
