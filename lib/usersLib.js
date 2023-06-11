import dbConnect from "./mongooseConnect";
import AppUser from "../models/userModel";
import Group from "../models/groupModel";

export const getAllUsers = async () => {
  await dbConnect();
  try {
    const users = await AppUser.find();
    return {
      success: true,
      users,
    };
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      error,
    };
  }
};

export const getOrCreateUser = async ({ email, name, image, roles }) => {
  await dbConnect();
  let user = await AppUser.findOne({ email }).populate("joinedGroups.group");
  if (!user) {
    try {
      user = new AppUser({
        email,
        name,
        image,
        roles,
      });
      await user.save();
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
  return user;
};


export const getUserId = async (email) => {
  await dbConnect();

  const user = await AppUser.findOne({ email });
  if (!user) {
    return {
      success: false,
      error: "User not found",
    };
  }
  return {
    success: true,
    userId: user._id,
  };
};

