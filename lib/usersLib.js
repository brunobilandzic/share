import dbConnect from "./mongooseConnect";
import AppUser from "../models/userModel";
import Group from "../models/groupModel";
import JoinGroupRequest from "../models/joinGroupRequestModel";
import { GROUP_MEMBER, GROUP_MODERATOR } from "../constants/roles";
import { notificationTypes } from "../constants/notificationTypes";
import Notification from "../models/notificationModel";
import { requestStatus } from "../constants/requestStatus";
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
      moderator.user.joinGroupRequestsReceived.push(newGroupRequest._id);
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

export const respondToJoinGroupRequest = async (
  joinGroupRequestId,
  moderatorEmail,
  response,
  socket
) => {
  try {
    await dbConnect();

    const joinGroupRequest = await JoinGroupRequest.findById(joinGroupRequestId)
      .populate({ path: "group", populate: { path: "usersRoles.user" } })
      .populate("sentBy");

    if (!joinGroupRequest) {
      return {
        success: false,
        error: "Join group request not found",
      };
    }

    if (joinGroupRequest.status != requestStatus.PENDING) {
      return {
        success: false,
        error: "Join group request already responded",
      };
    }

    if (
      !joinGroupRequest.group.usersRoles.map(
        (userRole) => userRole.user.email === moderatorEmail
      )
    ) {
      return {
        success: false,
        error: "User not moderator of group",
      };
    }

    if (
      joinGroupRequest.group.usersRoles.filter(
        (userRole) => userRole.user.email === joinGroupRequest.sentBy.email
      )?.length > 0
    ) {
      return {
        success: false,
        error: "User already in group",
      };
    }

    joinGroupRequest.status = response;

    response === requestStatus.ACCEPTED &&
      joinGroupRequest.group.usersRoles.push({
        user: joinGroupRequest.sentBy._id,
        role: GROUP_MEMBER,
      }) &&
      joinGroupRequest.sentBy.joinedGroups.push({
        group: joinGroupRequest.group._id,
        role: GROUP_MEMBER,
      });

    const newNotification = new Notification({
      text: `Your request to ${joinGroupRequest.group.name} was ${response}}`,
      type: notificationTypes.JOIN_GROUP_REQUEST_RESPONSE,
      user: joinGroupRequest.sentBy._id,
      joinGroupRequest: joinGroupRequest._id,
    });

    const sentBySocket = socket.onlineUsers?.find(
      (uSocket) => uSocket.userId === joinGroupRequest.sentBy.id
    );

    if (sentBySocket) {
      socket.to(sentBySocket.socketId).emit("notification", newNotification);
    }

    const moderators = joinGroupRequest.group.usersRoles.filter(
      (userRole) => userRole.role === GROUP_MODERATOR
    );

    await moderators.forEach(async (moderator) => {
      const newGroupMemberNotification = new Notification({
        text: `${joinGroupRequest.sentBy.name} request to join ${joinGroupRequest.group.name} was ${response}`,
        type: notificationTypes.GROUP_MEMBER_ADDED,
        user: moderator.user._id,
        joinGroupRequest: joinGroupRequest._id,
      });
      const moderatorSocket = socket.onlineUsers?.find(
        (uSocket) => uSocket.userId === moderator.user.id
      );
      if (moderatorSocket) {
        socket
          .to(moderatorSocket.socketId)
          .emit("notification", newGroupMemberNotification);
      }

      moderator.user.notifications?.push(newGroupMemberNotification._id);

      await moderator.user.save();
      await newGroupMemberNotification.save();
    });

    joinGroupRequest.sentBy.notifications?.push(newNotification._id);
    await joinGroupRequest.sentBy.save();
    await joinGroupRequest.group.save();
    await joinGroupRequest.save();
    await newNotification.save();

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
};

export const getRequests = async (groupId, userId) => {
  await dbConnect();
  const joinGroupRequests = await JoinGroupRequest.find({
    group: groupId,
    sentBy: userId,
  });
  if (!joinGroupRequests) {
    return {
      message: "Requests not found",
    };
  }

  return {
    requests: joinGroupRequests,
  };
};

export const leaveGroup = async (groupId, userId) => {
  await dbConnect();
  const group = await Group.findById(groupId).populate("usersRoles.user");
  if (!group) {
    return {
      success: false,
      error: "Group not found",
    };
  }
  console.log(
    userId,
    group.usersRoles.filter(
      (userRole) => userRole.user._id.toString() == userId.toString()
    )
  );
  const user = group.usersRoles.filter(
    (userRole) => userRole.user._id.toString() == userId.toString()
  )[0];
  if (!user) {
    return {
      success: false,
      error: "User not in group",
    };
  }

  const userIndex = group.usersRoles.findIndex(
    (userRole) => userRole.user._id == userId
  );
  group.usersRoles.splice(userIndex, 1);
  const groupIndex = user.user.joinedGroups.findIndex(
    (group) => group.group == groupId
  );
  user.user.joinedGroups.splice(groupIndex, 1);
  await user.user.save();
  await group.save();
  return {
    success: true,
  };
};
