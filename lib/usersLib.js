import dbConnect from "./mongooseConnect";
import AppUser from "../models/userModel";
import Group, { userGroupSchema } from "../models/groupModel";

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

export const getOrCreateUser = async ({ email, name, image }) => {
  await dbConnect();
  let user = await AppUser.findOne({ email });
  if (!user) {
    try {
      user = new AppUser({
        email,
        name,
        image,
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

export const getAllGroups = async () => {
  await dbConnect();
  try {
    const groups = await Group.find();
    return {
      success: true,
      groups,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const createGroup = async (name, userIds, creatorEmail) => {
  await dbConnect();
  const creator = await AppUser.findOne({ email: creatorEmail });
  if (!creator) {
    return {
      success: false,
      error: "Creator not found",
    };
  }

  try {
    const group = new Group({
      name,
    });
    group.createdBy = creator._id;
    creator.createdGroups.push(group._id);
    await creator.save();
    userIds.forEach(async (userId) => {
      group.users.push(new userGroupSchema({ userId, groupId: group._id }));
      let user = AppUser.findById(userId);
      user.groups.push(group._id);
      await user.save();
    });
    await group.save();
    return {
      success: true,
      group,
    };
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      error,
    };
  }
};
