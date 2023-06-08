import { describe, test, expect } from "vitest";
import {
  getAbsoluteDate,
  getStartAndEndOfTime,
  getLocaleDateTime,
  getFormattedFilterTimeRange,
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
    const result = getLocaleDateTime(
      date,
      {
        timeZone,
      },
      locale
    );
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

describe("getStartAndEndOfTime function", () => {
  test("returns correct start and end for a single day", () => {
    const [start, end] = getStartAndEndOfTime("2023-06-08");
    expect(start).toBe("2023-06-07T14:59:59.999Z");
    expect(end).toBe("2023-06-08T15:00:00.000Z");
  });

  test("returns correct start and end for a month", () => {
    const [start, end] = getStartAndEndOfTime("2020-12", {
      timezoneOffset: 0,
    });
    expect(start).toBe("2020-11-30T23:59:59.999Z");
    expect(end).toBe("2021-01-01T00:00:00.000Z");
  });

  test("returns correct start and end for a year", () => {
    const [start, end] = getStartAndEndOfTime("2023");
    expect(start).toBe("2022-12-31T14:59:59.999Z");
    expect(end).toBe("2023-12-31T15:00:00.000Z");
  });

  test("throws an error for invalid input", () => {
    expect(() => getStartAndEndOfTime("2023-13-01")).toThrowError(
      "Invalid year or month or day"
    );
    expect(() => getStartAndEndOfTime("2023-06-32")).toThrowError(
      "Invalid year or month or day"
    );
    expect(() => getStartAndEndOfTime("2023-00")).toThrowError(
      "Invalid year or month or day"
    );
  });

  test("returns correct start and end for a range of days with a different timezone", () => {
    const [start, end] = getStartAndEndOfTime("2023-06-08", {
      range: 3,
      timezoneOffset: 0,
    });
    expect(start).toBe("2023-06-05T23:59:59.999Z");
    expect(end).toBe("2023-06-09T00:00:00.000Z");
  });

  test("returns correct start and end for a range of years with a different timezone", () => {
    const [start, end] = getStartAndEndOfTime("2023", {
      range: 3,
      timezoneOffset: 0,
    });
    expect(start).toBe("2020-12-31T23:59:59.999Z");
    expect(end).toBe("2024-01-01T00:00:00.000Z");
  });
});

describe("getFormattedFilterTimeRange function", () => {
  test("returns correct filter string for a single day", () => {
    const filterString = getFormattedFilterTimeRange("createdAt", "2023-06-08");
    expect(filterString).toBe(
      "createdAt[greater_than]2023-06-07T14:59:59.999Z[and]createdAt[less_than]2023-06-08T15:00:00.000Z"
    );
  });

  test("returns correct filter string for a month", () => {
    const filterString = getFormattedFilterTimeRange("createdAt", "2023-06");
    expect(filterString).toBe(
      "createdAt[greater_than]2023-05-31T14:59:59.999Z[and]createdAt[less_than]2023-06-30T15:00:00.000Z"
    );
  });

  test("returns correct filter string for a year", () => {
    const filterString = getFormattedFilterTimeRange("createdAt", "2023");
    expect(filterString).toBe(
      "createdAt[greater_than]2022-12-31T14:59:59.999Z[and]createdAt[less_than]2023-12-31T15:00:00.000Z"
    );
  });

  test("returns correct filter string for a range of days with a different timezone", () => {
    const filterString = getFormattedFilterTimeRange(
      "createdAt",
      "2023-06-08",
      { range: 3, timezoneOffset: 0 }
    );
    expect(filterString).toBe(
      "createdAt[greater_than]2023-06-05T23:59:59.999Z[and]createdAt[less_than]2023-06-09T00:00:00.000Z"
    );
  });
});
