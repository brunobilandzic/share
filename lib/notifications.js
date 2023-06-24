import dbConnect from "./mongooseConnect";
import Notifications from "../models/notificationModel";

export const getAllNotificationsForUser = async (userId) => {
  await dbConnect();
  try {
    const notifications = await Notifications.find({ user: userId });
    return {
      success: true,
      notifications,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
};

export const getNotificationById = async (id) => {
  await dbConnect();
  try {
    const notification = await Notifications.findById(id).populate("joinGroupRequest");
    return {
      success: true,
      notification,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
}

export const readNotification = async (id, userId) => {
  await dbConnect();
  console.log(id, userId);
  try {
    const notification = await Notifications.findById(id);
    console.log(notification.user?.toString(), userId)
    if (notification.user?.toString() != userId?.toString()) {
      return {
        success: false,
        error: "User not authorized to read this notification",
      };
    }
    notification.seen = true;
    await notification.save();
    return {
      success: true,
      notification,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
}

export const readAllNotifications = async (userId) => {
  await dbConnect();
  try {
    const notifications = await Notifications.find({ user: userId });
    notifications?.forEach(async (notification) => {
      notification.seen = true;
      await notification.save();
    });
    return {
      success: true,
      notifications,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
}
