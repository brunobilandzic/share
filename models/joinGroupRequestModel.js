import mongoose from "mongoose";
import { requestStatus } from "../constants/requestStatus";

const joinGroupRequestObject = {
  sentBy: { type: mongoose.Types.ObjectId, ref: "AppUser" },
  group: { type: mongoose.Types.ObjectId, ref: "Group" },
  createdAt: { type: Date, default: () => Date.now() },
  status: {
    type: String,
    enum: Object.values(requestStatus),
    default: requestStatus.PENDING,
  },
  notifications: [{ type: mongoose.Types.ObjectId, ref: "Notification" }],
};

const joinGroupRequestSchema = new mongoose.Schema(joinGroupRequestObject);

module.exports =
  mongoose.models?.JoinGroupRequest ||
  mongoose.model("JoinGroupRequest", joinGroupRequestSchema);
