import mongoose from "mongoose";

const reservationObject = {
  item: { type: mongoose.Types.ObjectId, ref: "Item" },
  user: { type: mongoose.Types.ObjectId, ref: "AppUser" },
  comment: { type: String },
  holdDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  createdAt: { type: Date, default: () => Date.now() },
};

module.exports =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", new mongoose.Schema(reservationObject));
