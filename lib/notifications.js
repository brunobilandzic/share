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
