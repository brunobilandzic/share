import dbConnect from "./mongooseConnect";
import AppUser from "../models/userModel";
import Group from "../models/groupModel";
import { GROUP_MODERATOR } from "../constants/roles";

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
  let user = await AppUser.findOne({ email });
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

export const getAllGroups = async () => {
  await dbConnect();
  try {
    const groups = await Group.find();
    if (!groups) {
      return {
        success: false,
        error: "No groups found",
      };
    }
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

export const getGroupById = async (id) => {
  await dbConnect();
  try {
    const group = await Group.findById(id)
      .populate("usersRoles.user")
      .populate("items");
    
    if (!group) {
      return {
        success: false,
        error: "Group not found",
      };
    }
    return {
      success: true,
      group,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const createGroup = async (group) => {
  await dbConnect();
  const creator = await AppUser.findOne({ email: group.creatorEmail });
  if (!creator) {
    return {
      success: false,
      error: "Creator not found",
    };
  }

  try {
    const newGroup = new Group({
      name: group.name,
      description: group.description,
      createdBy: creator._id,
    });
    newGroup.createdBy = creator._id;
    newGroup.usersRoles.push({
      user: creator._id,
      role: GROUP_MODERATOR
    });
    creator.joinedGroups.push({
      group: newGroup._id,
      role: GROUP_MODERATOR
    })
    creator.createdGroups.push(group._id);
    /* users */
    await creator.save();

    await newGroup.save();
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
