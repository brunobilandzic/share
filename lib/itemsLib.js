import dbConnect from "./mongooseConnect";
import Item from "../models/itemModel";
import AppUser from "../models/userModel";

export const getAllItems = async () => {
  await dbConnect();
  try {
    const items = await Item.find({}).select(
      "name image reservations id holder createdAt"
    );
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

export const createItem = async (item) => {
  await dbConnect();
  const newItem = new Item(item);
  const appUser = await AppUser.findOne({ email: item.creatorEmail });

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

export const getItemById = async (id) => {
  await dbConnect();
  let item;
  try {
    item = await Item.findById(id).populate("createdBy", "name email image");
    if (!item)
      return {
        success: false,
      };
    return {
      success: true,
      item,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
