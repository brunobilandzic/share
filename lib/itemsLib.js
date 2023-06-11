import dbConnect from "./mongooseConnect";
import Item from "../models/itemModel";
import AppUser from "../models/userModel";
import Group from "../models/groupModel";

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

export const createItem = async (item, socket) => {
  await dbConnect();
  const newItem = new Item(item);
  const appUser = await AppUser.findOne({ email: item.creatorEmail });
  const group = await Group.findById(item.group);

  newItem.createdBy = appUser._id;

  if (!group || !appUser) return ({
    success: false,
    error: {
      message: "Group or user not found"
    }
  });
  
  appUser.createdItems.push(newItem._id);
  group?.items.push(newItem._id);

  try {   
    await appUser.save();
    await newItem.save();
    await group.save();
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
