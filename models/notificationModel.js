import mongoose from "mongoose";
import { notificationTypes } from "../constants/notificationTypes";

export const notificationObject = {
  text: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  link: {
    type: String,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "AppUser",
  },
  type: {
    type: String,
    enum: Object.values(notificationTypes),
  },
};

const notificationSchema = new mongoose.Schema(notificationObject);

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
