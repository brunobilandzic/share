import dbConnect from "./mongooseConnect";
import Item from "../models/itemModel";
import AppUser from "../models/userModel";

export const getAllItems = async () => {
  await dbConnect();
  try {
    const items = await Item.find({});
    return {
      success: true,
      items,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const createItem = async (item, user) => {
  await dbConnect();
  const newItem = new Item(item);
  const appUser = await AppUser.findOne({ email: user.email });

  newItem.createdBy = appUser._id;
  appUser.createdItems.push(newItem._id);
  try {
    await appUser.save();
    await newItem.save();
    return {
      success: true,
      item: newItem,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
