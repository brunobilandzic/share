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
