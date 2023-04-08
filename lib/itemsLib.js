import dbConnect from "./mongooseConnect";
import Item from "../models/itemModel";

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

export const createItem = async (item) => {
  await dbConnect();
  const newItem = new Item(item);
  try {
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
