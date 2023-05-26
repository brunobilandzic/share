import mongoose from "mongoose";
import { GROUP_MEMBER, GROUP_MODERATOR } from "../constants/roles";

export const userGroupObject = {
  user: { type: mongoose.Types.ObjectId, ref: "AppUser" },
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
  usersRoles: [{ type: userGroupSchema, default: [] }],
  description: { type: String },
  items: [{ type: mongoose.Types.ObjectId, ref: "Item", default: [] }],
  image: { type: String },
  createdBy: { type: mongoose.Types.ObjectId, ref: "AppUser" },
  createdAt: { type: Date, default: () => Date.now() },
  joinGroupRequests: [
    { type: mongoose.Types.ObjectId, ref: "JoinGroupRequest", default: [] },
  ],
};

const groupSchema = new mongoose.Schema(groupObject);

module.exports = mongoose.models?.Group || mongoose.model("Group", groupSchema);
