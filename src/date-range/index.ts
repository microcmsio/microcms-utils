/**
 * Get the start and end ISO strings of a month or day with timezone offset.
 *
 * @param yearMonthDay {string} - The date string in "YYYY-MM" or "YYYY-MM-DD" format. ex. 2020-01 or 2020-01-01
 * @param timezoneOffset {number} - The timezone offset in hours. ex. 9 for JST
 * @returns {[string, string]} - An array containing the start and end ISO strings. ex. ["2022-12-31T23:59:59.999Z", "2020-02-01T00:00:00.000Z"]
 */
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

/**
 * Get a formatted filter time range string for a specific field and date.
 *
 * @param fieldName {string} - The name of the field to filter.
 * @param yearMonthDay {string} - The date string in "YYYY-MM-DD" or "YYYY-MM" format.
 * @param timezoneOffset {number} - The timezone offset in minutes.
 *
 * @returns {string} - A formatted filter time range string.
 */
export function getFormattedFilterTimeRange(
  fieldName: string,
  yearMonthDay: string,
  timezoneOffset: number
): string {
  // Get the start and end of the month / day with timezone adjustment
  const [start, end] = getStartAndEndOfTime(yearMonthDay, timezoneOffset);

  // Return the formatted string
  return `${fieldName}[greater_than]${start}[and]${fieldName}[less_than]${end}`;
}
