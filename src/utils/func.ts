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
  date.setHours(0, 0, 0, 0);
  return date;
};

export const roundToStartOfDay = (date: Date): Date => {
  date.setHours(0, 0, 0, 0);
  return date;
};
export const roundToNextHour = (date: Date): Date => {
  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + 2);
  return date;
};

export const roundToPreviousHour = (date: Date): Date => {
  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() - 1);
  return date;
};
