import mongoose from "mongoose";
import { GROUP_MEMBER, GROUP_MODERATOR } from "../constants/roles";

export const userGroupObject = {
  groupId: { type: mongoose.Types.ObjectId, ref: "Group" },
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
  groups: [userGroupSchema],
};

module.exports =
  mongoose.models.AppUser ||
  mongoose.model("AppUser", new mongoose.Schema(userObject));
