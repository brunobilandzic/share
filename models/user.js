import mongoose from "mongoose";

const userObject = {
  name: { type: String, required: true },
  passwordHash: { type: String },
  isOauthUser: { type: Boolean, default: false },
};

module.exports =
  mongoose.models.User ||
  mongoose.model("User", new mongoose.Schema(userObject));
