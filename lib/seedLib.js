import { users, groups, groupCreators } from "../constants/seed/users.js";
import { reservations } from "../constants/seed/reservations";
import { items } from "../constants/seed/items";
import dbConnect from "./mongooseConnect.js";
import AppUser from "../models/userModel.js";
import Group from "../models/groupModel.js";
import Item from "../models/itemModel.js";
import Reservation from "../models/reservationModel.js";

import {
  buildReservation,
  getRandomNumber,
  isNowBetweenDates,
} from "../util/helpers.js";
import { GROUP_MEMBER, GROUP_MODERATOR } from "../constants/roles.js";

export const seedGroups = async () => {
  await dbConnect();
  try {
    await Group.deleteMany({});
    await AppUser.deleteMany({});
    await Item.deleteMany({});
    await Reservation.deleteMany({});

    const _groupCreators = [...groupCreators];

    await groups.forEach(async (groupJSON, index) => {
      const groupCreator = _groupCreators[index];

      const newGroupCreator = new AppUser({
        name: groupCreator.name,
        email: groupCreator.email,
        image: groupCreator.image,
      });

      const newGroup = new Group({
        name: groupJSON.name,
        description: groupJSON.description,
        createdAt: groupJSON.createdAt,
        createdBy: newGroupCreator._id,
        image: "https://picsum.photos/200",
      });

      newGroupCreator.createdGroups.push(newGroup._id);
      newGroupCreator.groups.push({
        groupId: newGroup._id,
        role: GROUP_MODERATOR,
      });
      newGroup.users.push({
        userId: newGroupCreator._id,
        role: GROUP_MODERATOR,
      });
      await newGroupCreator.save();
      await newGroup.save();

      console.log(
        `Group ${newGroup.name} number ${index + 1} seeded successfully`
      );
      console.log(
        `Group creator ${newGroupCreator.name} number ${
          index + 1
        } seeded successfully`
      );
    });

    return {
      message: `Groups seeded successfully`,
      success: true,
    };
  } catch (error) {
    console.log("Error seeding groups: ", error);
    return {
      message: `Error seeding groups`,
      success: false,
    };
  }
};

export const seedUsersAndItems = async () => {
  try {
    await AppUser.deleteMany({ groups: { $exists: false } });
    await Item.deleteMany({});
    await Reservation.deleteMany({});

    const workUsers = [...users];
    let workItems = [...items];

    const dbGroups = await Group.find({});
    await dbGroups.forEach(async (group) => {
      for (let i = 0; i < getRandomNumber(0, 10); i++) {
        const user = workUsers[getRandomNumber(0, workUsers.length - 1)];
        workUsers.filter((workUser) => workUser.email !== user?.email);

        if (user) {
          const createdUser = new AppUser({
            name: user.name,
            email: user.email,
            image: user.image,
            groups: [group._id],
          });

          group.users.push({ userId: createdUser._id, role: GROUP_MEMBER });
          createdUser.groups.push({ groupId: group._id, role: GROUP_MEMBER });

          for (let i = 0; i < getRandomNumber(0, 5); i++) {
            let item;

            item = workItems[getRandomNumber(0, workItems.length - 1)];

            workItems = workItems.filter(
              (workItem) => workItem.name !== item?.name
            );

            if (!item) continue;

            const createdItem = new Item({
              name: item.name,
              description: item.description,
              image: item.image,
              createdBy: createdUser._id,
              holder: null,
              group: group._id,
            });

            group.items.push(createdItem._id);
            createdUser.createdItems.push(createdItem._id);

            await createdItem.save();
            console.log("Item created: ", createdItem.name);
          }

          await createdUser.save();
          console.log("User created: ", createdUser.name);
        }
      }

      await group.save();
    });
    return {
      message: `Users and items seeded successfully`,
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: `Error seeding users and items`,
      success: false,
    };
  }
};

export const seedReservations = async () => {
  await dbConnect();
  try {
    await Reservation.deleteMany({});

    let workReservations = [...reservations];

    const dbItems = await Item.find({});

    for (const item of dbItems) {
      if (Math.random() < 0.5) continue;

      let reservation =
        workReservations[getRandomNumber(0, workReservations.length - 1)];
      workReservations = workReservations.filter(
        (workReservation) => workReservation.comment != reservation?.comment
      );

      if (!reservation) continue;

      const group = await Group.findById(item.group).populate("users");
      const userIds = group.users.map((user) => user.userId);
      const userId = userIds[getRandomNumber(0, userIds.length - 1)];
      const user = await AppUser.findById(userId);

      if (!user) continue;

      reservation = buildReservation(reservation);
      const newReservation = new Reservation({
        comment: reservation.comment,
        holdDate: reservation.holdDate,
        returnDate: reservation.returnDate,
        createdAt: reservation.createdAt,
        item: item._id,
        user: user._id,
      });

      item.reservations.push(newReservation._id);

      if (
        isNowBetweenDates(newReservation.holdDate, newReservation.returnDate)
      ) {
        item.holder = user._id;
        user.holding.push(item._id);
      }

      user.reservations.push(newReservation._id);

      await newReservation.save();
      await item.save();
      await user.save();

      console.log(
        `${newReservation.comment} seeded successfully, reserved by ${user.name}`
      );
    }

    return {
      message: `Reservations seeded successfully`,
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: `Error seeding reservations`,
      success: false,
    };
  }
};
