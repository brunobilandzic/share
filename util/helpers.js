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
