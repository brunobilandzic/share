import dbConnect from "./mongooseConnect";
import AppUser from "../models/userModel";

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
