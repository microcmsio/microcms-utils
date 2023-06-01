/**
 * Takes an ISO 8601 date string and an offset in hours, and returns the absolute time (UNIX time).
 *
 * @param {string} isoDateString - The date string in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ).
 * @param {number} [timezoneOffset=9] - The offset from UTC in hours. The default is 9 (JST).
 * @returns {Date} - A JavaScript Date object based on the given ISO 8601 date and offset hours.
 */
export function getAbsoluteTime(
  isoDateString: string,
  timezoneOffset: number = 9
): Date {
  // Convert ISO date string to Unix timestamp
  const unixtime = isoToUnixTime(isoDateString);

  // Calculate absolute time
  // Add timezone offset and specified offset hours to Unix timestamp
  return new Date(
    unixtime +
      (new Date().getTimezoneOffset() + timezoneOffset * 60) * 60 * 1000
  );
}

/**
 * Converts an ISO 8601 date string to UNIX time.
 *
 * This function creates a JavaScript Date object from the provided ISO 8601 date string. It then returns the
 * corresponding UNIX time (the number of milliseconds since the UNIX epoch, January 1, 1970 00:00:00 UTC),
 * rounded down to the nearest whole number.
 *
 * @param {string} isoDateString - The date string in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ).
 * @returns {number} - The UNIX time corresponding to the provided ISO 8601 date string.
 */
export function isoToUnixTime(isoDateString: string): number {
  const date = new Date(isoDateString);
  return Math.floor(date.getTime());
}

/**
 * Converts a UNIX timestamp to an ISO 8601 date string.
 *
 * This function creates a JavaScript Date object from the provided UNIX timestamp (the number of milliseconds since the
 * UNIX epoch, January 1, 1970 00:00:00 UTC). It then returns the corresponding ISO 8601 date string.
 *
 * @param {number} unixTimestamp - The UNIX timestamp to convert.
 * @returns {string} - The ISO 8601 date string corresponding to the provided UNIX timestamp.
 */
export function unixTimeToIso(unixTimestamp: number): string {
  const date = new Date(unixTimestamp);
  return date.toISOString();
}

/**
 * Get the start and end ISO strings of a month or day with timezone offset.
 *
 * @param yearMonthDay {string} - The date string in "YYYY-MM" or "YYYY-MM-DD" format. ex. 2020-01 or 2020-01-01
 * @param timezoneOffset {number} - [timezoneOffset=9] The timezone offset in hours. ex. 9 for JST
 * @returns {[string, string]} - An array containing the start and end ISO strings. ex. ["2022-12-31T23:59:59.999Z", "2020-02-01T00:00:00.000Z"]
 */
export function getStartAndEndOfTime(
  yearMonthDay: string,
  timezoneOffset: number = 9
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
 * @param timezoneOffset {number} [timezoneOffset=9] - The timezone offset in minutes.
 *
 * @returns {string} - A formatted filter time range string.
 */
export function getFormattedFilterTimeRange(
  fieldName: string,
  yearMonthDay: string,
  timezoneOffset: number = 9
): string {
  // Get the start and end of the month / day with timezone adjustment
  const [start, end] = getStartAndEndOfTime(yearMonthDay, timezoneOffset);

  // Return the formatted string
  return `${fieldName}[greater_than]${start}[and]${fieldName}[less_than]${end}`;
}
