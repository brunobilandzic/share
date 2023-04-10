import AppUser from "../models/userModel";
import dbConnect from "./mongooseConnect";

export const getAllUsers = async () => {
    await dbConnect();
    try {
        const users = await AppUser.find()
        .populate("createdItems")
        .populate("holding")
        .populate("reservations");
        return {
        success: true,
        users,
        };
    } catch (error) {
        return {
        success: false,
        error,
        };
    }
}
    
export const getOrCreateUser = async ({ email, name, image }) => {
  await dbConnect();
  let user = await AppUser.findOne({ email });
  if (!user) {
    user = new AppUser({
      email,
      name,
      image,
    });
    await user.save();
  }
  return user;
};
