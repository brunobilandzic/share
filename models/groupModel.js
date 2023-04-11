import mongoose from "mongoose";
import { GROUP_MEMBER, GROUP_MODERATOR } from "../constants/roles";

export const userGroupObject = {
  userId: { type: mongoose.Types.ObjectId, ref: "AppUser" },
  groupId: { type: mongoose.Types.ObjectId, ref: "Group" },
  role: {
    type: String,
    enum: [GROUP_MEMBER, GROUP_MODERATOR],
    default: GROUP_MEMBER,
    required: true,
  },
};

export const userGroupSchema = new mongoose.Schema(userGroupObject);

const groupObject = {
  name: { type: String, required: true },
  users: [userGroupObject],
  items: [{ type: mongoose.Types.ObjectId, ref: "Item" }],
  createdBy: { type: mongoose.Types.ObjectId, ref: "AppUser" },
  createdAt: { type: Date, default: () => Date.now() },
};

const groupSchema = new mongoose.Schema(groupObject);

module.exports = mongoose.models?.Group || mongoose.model("Group", groupSchema);
