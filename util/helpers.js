export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const isNowBetweenDates = (startDateString, endDateString) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  const now = new Date();
  return now >= startDate && now <= endDate;
};

export const buildReservation = (reservationJSON) => {
  const holdDate = new Date(
    new Date(reservationJSON.createdAt).getTime() +
      getPositiveOrNegative() * 1000 * 60 * 60 * 24 * 7 * Math.random()
  );
  const returnDate = new Date(
    new Date(holdDate).getTime() + 1000 * 60 * 60 * 24 * Math.random()
  );

  return {
    ...reservationJSON,
    holdDate,
    returnDate,
  };
};

export const getPositiveOrNegative = () => {
  return Math.random() < 0.5 ? -1 : 1;
};

export const buildItemForThumbnail = (item) => {
  return {
    id: item._id?.toString() || null,
    name: item.name || null,
    createdAt: item.createdAt?.toString() || null,
    reservations: item.reservations?.length || 0,
  };
};

export const buildItem = (itemJSON) => {
  return {
    id: itemJSON._id?.toString() || null,
    name: itemJSON.name || null,
    description: itemJSON.description || null,
    image: itemJSON.image || null,
    createdBy: {
      id: itemJSON.createdBy?._id?.toString() || null,
      name: itemJSON.createdBy?.name || null,
      email: itemJSON.createdBy?.email || null,
    },
    available: itemJSON.available || null,
    createdAt: itemJSON.createdAt?.toString() || null,
    reservations:
      itemJSON.reservations?.map((reservation) =>
        buildReservationForItem(reservation)
      ) || [],
    holder: itemJSON.holder || null,
  };
};

export const buildReservationForItem = (reservation) => {
  return {
    id: reservation._id?.toString() || null,
    holdDate: reservation.startDate?.toString() || null,
    returnDate: reservation.returnDate?.toString() || null,
    user: reservation.user?.toString() || null,
    comment: reservation.comment || null,
  };
};

export const buildGroupForThumbnail = (group) => {
  return {
    id: group._id?.toString() || null,
    name: group.name || null,
    createdAt: group.createdAt?.toString() || null,
    users: group.usersRoles?.length || 0,
  };
};

export const buildGroup = (group) => {
  return {
    id: group._id?.toString() || null,
    name: group.name || null,
    items: group.items?.map((item, i) => buildItem(item)) || null,
    description: group.description || null,
    createdAt: group.createdAt?.toString() || null,
    usersRoles:
      group.usersRoles?.map((userRole) => buildUserRole(userRole)) || null,
  };
};

export const buildUserRole = (userRole) => {
  return {
    id: userRole.user?.id?.toString() || null,
    name: userRole.user?.name || null,
    role: userRole?.role || null,
    image: userRole.user?.image || null,
  };
};

export const sortByCreatedAt = (array) => {
  return array.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const buildNotification = (notification) => {
  return {
    id: notification._id?.toString() || null,
    message: notification.message || null,
    createdAt: notification.createdAt?.toString() || null,
    read: notification.read || null,
    link: notification.link || null,
    text: notification.text || null,
    joinGroupRequest: buildJoinGroupRequestForNotification(
      notification.joinGroupRequest
    ),
  };
};

export const buildJoinGroupRequestForNotification = (joinGroupRequest) => {
  return {
    id: joinGroupRequest._id?.toString() || null,
    sentBy: joinGroupRequest.sentBy?.toString() || null,
    group: joinGroupRequest.group?.toString() || null,
    status: joinGroupRequest.status || null,
    createdAt: joinGroupRequest.createdAt?.toString() || null,
    notifications:
      joinGroupRequest.notifications?.map((notification) => ({
        id: notification._id?.toString() || null,
      })) || null,
  };
};
