export const formatDateToString = (date: Date, cutSeconds = true) => {
  let formattedDate = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
  if (cutSeconds) {
    formattedDate = formattedDate.slice(0, -3);
  }
  return formattedDate;
};
export const roundToHalfHour = (date: Date): Date => {
  const roundedMinutes = Math.ceil(date.getMinutes() / 30) * 30;
  date.setMinutes(roundedMinutes);
  return date;
};

export const roundToEndOfDay = (date: Date): Date => {
  date.setHours(23, 59, 59, 999);
  return date;
};
