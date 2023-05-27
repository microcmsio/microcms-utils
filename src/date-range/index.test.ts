import { describe, test, expect } from "vitest";
import { getFormattedFilterTimeRange, getStartAndEndOfTime } from "./index";

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
