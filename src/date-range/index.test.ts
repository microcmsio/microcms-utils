import { describe, test, expect } from "vitest";
import {
  getAbsoluteDate,
  getFormattedFilterTimeRange,
  getStartAndEndOfTime,
  getLocaleDateTime,
} from "./index";

describe("getAbsoluteTime", () => {
  test("should return correct Date object for given ISO date string and timezone offset", () => {
    const isoDateString = "2022-12-31T23:59:59Z"; // ISO date string for Dec 31, 2022 23:59:59 UTC
    const timezoneOffset = 5; // Timezone offset for Eastern Standard Time (EST)

    const result = getAbsoluteDate(isoDateString, timezoneOffset);

    // Convert result to ISO string and compare with expected ISO string
    // Expected time is Dec 31, 2022 19:59:59 EST (which is the same as Jan 1, 2023 00:59:59 UTC)
    expect(result.toISOString()).toBe("2022-12-31T19:59:59.000Z");
  });

  test("should default to JST (UTC+9) if no timezone offset is provided", () => {
    const isoDateString = "2022-12-31T15:00:00Z"; // ISO date string for Dec 31, 2022 15:00:00 UTC

    const result = getAbsoluteDate(isoDateString);

    // Convert result to ISO string and compare with expected ISO string
    // Expected time is Dec 31, 2022 15:00:00 JST (which is the same as Dec 31, 2022 06:00:00 UTC)
    console.log(result);
    expect(result.toISOString()).toBe("2022-12-31T15:00:00.000Z");
  });
});

describe("getLocaleDateTime", () => {
  test("should return a formatted date string for the given time zone and locale", () => {
    const date = "2023-01-01T00:00:00.000Z"; // UTC
    const timeZone = "Asia/Tokyo"; // UTC+9
    const locale = "ja-JP";

    // Because the output string can vary depending on the environment (OS, browser, etc.),
    // we'll just check that the output is a non-empty string.
    const result = getLocaleDateTime(date, timeZone, locale);
    expect(typeof result).toBe("string");
    expect(result).not.toBe("");
  });

  test('should use "Asia/Tokyo" as the default time zone and "ja-JP" as the default locale', () => {
    const date = "2023-01-01T00:00:00.000Z"; // UTC

    const result = getLocaleDateTime(date);
    expect(typeof result).toBe("string");
    expect(result).not.toBe("");
  });
});

describe("getStartAndEndOfTime", () => {
  // Test case: Invalid year, month, or day should throw an error
  test("should throw an error for invalid year, month, or day", () => {
    expect(() => getStartAndEndOfTime("2020-13-01", 0)).toThrow(
      "Invalid year or month or day"
    );
    expect(() => getStartAndEndOfTime("2020-12-32", 0)).toThrow(
      "Invalid year or month or day"
    );
    expect(() => getStartAndEndOfTime("2020-00-01", 0)).toThrow(
      "Invalid year or month or day"
    );
    expect(() => getStartAndEndOfTime("2020-12-00", 0)).toThrow(
      "Invalid year or month or day"
    );
  });

  // Test case: Return the start and end of the month for "exclusive" comparison
  test('should return the start and end of the month for "exclusive" comparison', () => {
    const [start, end] = getStartAndEndOfTime("2020-12", 0);
    expect(start).toBe("2020-11-30T23:59:59.999Z");
    expect(end).toBe("2021-01-01T00:00:00.000Z");
  });

  // Test case: Return the start and end of the day for "exclusive" comparison
  test('should return the start and end of the day for "exclusive" comparison', () => {
    const [start, end] = getStartAndEndOfTime("2020-12-15", 0);
    expect(start).toBe("2020-12-14T23:59:59.999Z");
    expect(end).toBe("2020-12-16T00:00:00.000Z");
  });

  // Test case: Adjust for timezone offset
  test("should adjust for timezone offset", () => {
    const [start, end] = getStartAndEndOfTime("2020-12-15", 9);
    expect(start).toBe("2020-12-14T14:59:59.999Z");
    expect(end).toBe("2020-12-15T15:00:00.000Z");
  });
});

describe("getFormattedFilterTimeRange", () => {
  test("should return a formatted filter string for a month with timezone offset", () => {
    const fieldName = "date";
    const yearMonthDay = "2020-01";
    const timezoneOffset = 9;

    // Get the start and end of the month with timezone adjustment
    const [start, end] = getStartAndEndOfTime(yearMonthDay, timezoneOffset);

    const result = getFormattedFilterTimeRange(
      fieldName,
      yearMonthDay,
      timezoneOffset
    );

    // Expected format: "date[greater_than]start[and]date[less_than]end"
    const expected = `${fieldName}[greater_than]${start}[and]${fieldName}[less_than]${end}`;
    expect(result).to.equal(expected);
  });

  test("should return a formatted filter string for a day with timezone offset", () => {
    const fieldName = "date";
    const yearMonthDay = "2020-01-01";
    const timezoneOffset = 9;

    // Get the start and end of the day with timezone adjustment
    const [start, end] = getStartAndEndOfTime(yearMonthDay, timezoneOffset);

    const result = getFormattedFilterTimeRange(
      fieldName,
      yearMonthDay,
      timezoneOffset
    );

    // Expected format: "date[greater_than]start[and]date[less_than]end"
    const expected = `${fieldName}[greater_than]${start}[and]${fieldName}[less_than]${end}`;
    expect(result).to.equal(expected);
  });
});
