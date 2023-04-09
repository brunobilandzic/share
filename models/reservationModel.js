const reservationObject = {
  item: { type: mongoose.Types.ObjectId, ref: "Item" },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  returned: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => Date.now() },
};

module.exports =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", new mongoose.Schema(reservationObject));
