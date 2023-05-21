export function getStartAndEndOfTime(
  yearMonthDay: string,
  timezoneOffset: number
): [string, string] {
  // Split the input into year, month, and day
  const [year, month, day] = yearMonthDay.split("-").map(Number);

  // Check for invalid year, month, or day (minimal error checking)
  if (year < 0 || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error("Invalid year or month or day");
  }

  // Create a Date object for the first day of the month / the start of the day
  const startOfMonthOrDay = new Date(
    Date.UTC(year, month - 1, day || 1, -timezoneOffset)
  );

  // Subtract 1 millisecond
  startOfMonthOrDay.setMilliseconds(startOfMonthOrDay.getMilliseconds() - 1);

  // Create a Date object for the last day of the month / the end of the day
  const endOfMonthOrDay = new Date(
    Date.UTC(
      day ? year : month === 12 ? year + 1 : year,
      day ? month - 1 : month % 12,
      day ? day + 1 : 1,
      -timezoneOffset
    )
  );

  // Return the start and end of the month / day in ISO format
  return [startOfMonthOrDay.toISOString(), endOfMonthOrDay.toISOString()];
}

export function getFormattedTimeRange(
  fieldName: string,
  yearMonthDay: string,
  timezoneOffset: number
): string {
  // Get the start and end of the month / day with timezone adjustment
  const [start, end] = getStartAndEndOfTime(yearMonthDay, timezoneOffset);

  // Return the formatted string
  return `${fieldName}[greater_than]${start}[and]${fieldName}[less_than]${end}`;
}
