export const formatDateToString = (date: Date, cutSeconds = true) => {
  let formattedDate = `${date.toLocaleDateString()}`;
  if (
    !(
      date.getHours() === 0 &&
      date.getMinutes() === 0 &&
      date.getSeconds() === 0
    )
  ) {
    formattedDate += `, ${date.toLocaleTimeString()}`;
    if (cutSeconds) {
      formattedDate = formattedDate.slice(0, -3);
    }
  }
  return formattedDate;
};

export const roundToHalfHour = (date: Date): Date => {
  const roundedMinutes = Math.ceil(date.getMinutes() / 30) * 30;
  date.setMinutes(roundedMinutes);
  date.setSeconds(0);
  return date;
};

export const roundToZero = (date: Date): Date => {
  date.setHours(0, 0, 0, 0);
  return date;
};

export const roundToEndOfDay = (date: Date): Date => {
  date.setHours(23, 59, 59, 999);
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
