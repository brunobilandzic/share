import mongoose from "mongoose";
import {
  ADMINISTRATOR,
  GROUP_MEMBER,
  GROUP_MODERATOR,
  REGULAR,
} from "../constants/roles";

export const userGroupObject = {
  group: { type: mongoose.Types.ObjectId, ref: "Group" },
  role: {
    type: String,
    enum: [GROUP_MEMBER, GROUP_MODERATOR],
    default: GROUP_MEMBER,
    required: true,
  },
};

export const userGroupSchema = new mongoose.Schema(userGroupObject);

const userObject = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  createdAt: { type: Date, default: () => Date.now() },
  createdItems: [{ type: mongoose.Types.ObjectId, ref: "Item" }],
  holding: [{ type: mongoose.Types.ObjectId, ref: "Item" }],
  reservations: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }],
  createdGroups: [{ type: mongoose.Types.ObjectId, ref: "Group" }],
  joinedGroups: [userGroupSchema],
  roles: [{ type: String, required: true, enum: [ADMINISTRATOR, REGULAR] }],
  joinGroupRequestsSent: [{ type: mongoose.Types.ObjectId, ref: "JoinGroupRequest" }],
  joinGroupRequestsReceived: [{ type: mongoose.Types.ObjectId, ref: "JoinGroupRequest" }],
  notifications: [{ type: mongoose.Types.ObjectId, ref: "Notification" }],
};

module.exports =
  mongoose.models.AppUser ||
  mongoose.model("AppUser", new mongoose.Schema(userObject));
