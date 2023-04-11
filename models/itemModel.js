import mongoose from "mongoose";

const itemObject = {
  name: { type: String, required: true },
  description: {
    type: String,
    required: true,
  },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => Date.now() },
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }],
  holder: { type: mongoose.Schema.Types.ObjectId, ref: "AppUser" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "AppUser" },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
};

const itemSchema = new mongoose.Schema(itemObject);

module.exports = mongoose.models?.Item || mongoose.model("Item", itemSchema);
