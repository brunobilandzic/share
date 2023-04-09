import mongoose from "mongoose";

const userObject = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  createdAt: { type: Date, default: () => Date.now() },
  created: [{ type: mongoose.Types.ObjectId, ref: "Item" }],
  holding: [{ type: mongoose.Types.ObjectId, ref: "Item" }],
  reservations: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }],
};

module.exports =
  mongoose.models.AppUser ||
  mongoose.model("AppUser", new mongoose.Schema(userObject));
