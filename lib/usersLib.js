import dbConnect from "./mongooseConnect";
import AppUser from "../models/userModel";
import Group from "../models/groupModel";
import JoinGroupRequest from "../models/joinGroupRequestModel";
import { GROUP_MODERATOR } from "../constants/roles";
import { notificationTypes } from "../constants/notificationTypes";
import Notification from "../models/notificationModel";
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

export const joinGroup = async (groupId, userEmail, socket) => {
  await dbConnect();
  try {
    const group = await Group.findById(groupId).populate("usersRoles.user");
    const user = await AppUser.findOne({ email: userEmail });
    if (!group || !user) {
      return {
        success: false,
        error: "Group or user not found",
      };
    }

    const membersIds = group.usersRoles.map((member) => member.user.id);
    if (membersIds.includes(user._id)) {
      return {
        success: false,
        error: "User already in group",
      };
    }

    const moderators = group.usersRoles.filter(
      (userRole) => userRole.role === GROUP_MODERATOR
    );

    const newGroupRequest = new JoinGroupRequest({
      group: group._id,
      sentBy: user._id,
    });

    group.joinGroupRequests.push(newGroupRequest._id);

    console.log(group);

    await moderators.forEach(async (moderator) => {
      const newNotification = new Notification({
        text: `${user.name} wants to join ${group.name}`,
        type: notificationTypes.JOIN_GROUP_REQUEST,
        user: moderator.user._id,
      });

      const moderatorSocket = socket.onlineUsers?.find(
        (uSocket) => uSocket.userId === moderator.user.id
      );
      if (moderatorSocket) {
        socket
          .to(moderatorSocket.socketId)
          .emit("notification", newNotification);
      }

      newGroupRequest.notifications.push(newNotification._id);
      newNotification.joinGroupRequest = newGroupRequest._id;

      moderator.user.notifications?.push(newNotification._id);
      user.joinGroupRequestsSent.push(newGroupRequest._id);

      await user.save();
      await newNotification.save();
      await moderator.user.save();
      await newGroupRequest.save();
    });

    await group.save();

    return {
      success: true,
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
    console.log("newGroup", newGroup);
    newGroup.createdBy = creator._id;
    newGroup.usersRoles.push({
      user: creator._id,
      role: GROUP_MODERATOR,
    });
    creator.joinedGroups.push({
      group: newGroup._id,
      role: GROUP_MODERATOR,
    });
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
