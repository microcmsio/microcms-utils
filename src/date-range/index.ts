/**
 * Takes an ISO 8601 date string and an offset in hours, and returns the absolute time (UNIX time).
 *
 * @param {string} isoDateString - The date string in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ).
 * @param {number} [timezoneOffset=9] - The offset from UTC in hours. The default is 9 (JST).
 * @returns {Date} - A JavaScript Date object based on the given ISO 8601 date and offset hours.
 */
export function getAbsoluteDate(
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
 * Converts a date string to a localized string representation in the specified time zone.
 *
 * @param {string} date - The date string to convert. This should be in a format recognized by the Date.parse() method.
 * @param {string} [timeZone="Asia/Tokyo"] - The time zone to use for the conversion. Defaults to 'Asia/Tokyo'.
 * @param {string} [locale="ja-JP"] - The locale to use for the conversion. Defaults to 'ja-JP'.
 *
 * @returns {string} The date string formatted according to the locale and time zone.
 */
export function getLocaleDateTime(
  date: string,
  timeZone: string = "Asia/Tokyo",
  locale: string = "ja-JP"
): string {
  // Create a new Date object from the input date string
  let dateObj = new Date(date);

  // Convert the Date object to a string using the specified locale and time zone
  // and return the result
  return dateObj.toLocaleString(locale, {
    timeZone,
  });
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
 * Get the start and end ISO strings of a specific day or a range of days or months, adjusted for timezone offset.
 *
 * @param yearMonthDay {string} - The date string in "YYYY-MM-DD" format for a specific day, or "YYYY-MM" format for a range of days within a month, or "YYYY" format for a range of months within a year. ex. 2020-01-01, 2020-01, or 2020
 * @param options {Object} [options={ range: 1, timezoneOffset: 9 }] - An object with optional properties 'range' and 'timezoneOffset'.
 * @param options.range {number} - The number of days for the range, starting from the specified date. If yearMonthDay is in "YYYY-MM" format, the range covers the entire month. If yearMonthDay is in "YYYY" format, the range covers the entire year.
 * @param options.timezoneOffset {number} - The timezone offset in hours from UTC. ex. 9 for JST
 * @returns {[string, string]} - An array containing the start and end ISO strings for the specified day or range of days. ex. ["2020-01-01T00:00:00.000Z", "2020-01-01T23:59:59.999Z"], ["2020-01-01T00:00:00.000Z", "2020-01-31T23:59:59.999Z"], or ["2020-01-01T00:00:00.000Z", "2020-12-31T23:59:59.999Z"]
 */
export function getStartAndEndOfTime(
  yearMonthDay: string,
  options: { range?: number; timezoneOffset?: number } = {}
): [string, string] {
  // Destructure the options object into individual variables
  const { range = 1, timezoneOffset = 9 } = options;

  // Split the input into year, month, and possibly day
  const [year, month, day] = yearMonthDay.split("-").map(Number);

  // Check for invalid year, month, or day values
  if (year < 0 || month < 1 || month > 12 || (day && (day < 1 || day > 31))) {
    throw new Error("Invalid year or month or day");
  }

  // Create a Date object for the start of the specified day or the first day of the specified month or the first month of the specified year
  const startOfMonthOrDay = new Date(
    Date.UTC(
      year,
      day ? month - 1 : month - range,
      day ? day - range + 1 : 1,
      -timezoneOffset
    )
  );

  // Subtract 1 millisecond to get the end of the previous day or month or year
  startOfMonthOrDay.setMilliseconds(startOfMonthOrDay.getMilliseconds() - 1);

  // Create a Date object for the end of the specified day or the last day of the specified month or the last month of the specified year
  const endOfMonthOrDay = new Date(
    Date.UTC(
      day ? year : month === 12 ? year + 1 : year,
      day ? month - 1 : month % 12,
      day ? day + 1 : 1,
      -timezoneOffset
    )
  );

  // Return the start and end of the specified day or range of days or range of months in ISO format
  return [startOfMonthOrDay.toISOString(), endOfMonthOrDay.toISOString()];
}

/**
 * Get a formatted filter time range string for a specific field and a day or range of days or months.
 *
 * @param fieldName {string} - The name of the field to filter.
 * @param yearMonthDay {string} - The date string in "YYYY-MM-DD" format for a specific day, "YYYY-MM" format for a range of days within a month, or "YYYY" format for a range of months within a year.
 * @param options {Object} [options={ range: 1, timezoneOffset: 9 }] - An object with optional properties 'range' and 'timezoneOffset'.
 * @param options.range {number} - The number of days for the range, starting from the specified date. If yearMonthDay is in "YYYY-MM" format, the range covers the entire month. If yearMonthDay is in "YYYY" format, the range covers the entire year.
 * @param options.timezoneOffset {number} - The timezone offset in hours from UTC.
 *
 * @returns {string} - A formatted filter time range string, indicating that the field value should be within the specified day or range of days or range of months.
 */
export function getFormattedFilterTimeRange(
  fieldName: string,
  yearMonthDay: string,
  options: { range?: number; timezoneOffset?: number } = {}
): string {
  // Get the start and end ISO strings for the specified day or range of days or range of months, adjusted for timezone
  const [start, end] = getStartAndEndOfTime(yearMonthDay, options);

  // Return the formatted filter string, which specifies that the field value should be greater than the start time and less than the end time
  return `${fieldName}[greater_than]${start}[and]${fieldName}[less_than]${end}`;
}
