import { describe, test, expect } from "vitest";
import { getStartAndEndOfTime } from "./index";

describe("getStartAndEndOfTime", () => {
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

  test('should return the start and end of the month for "exclusive" comparison', () => {
    const [start, end] = getStartAndEndOfTime("2020-12", 0);
    expect(start).toBe("2020-11-30T23:59:59.999Z");
    expect(end).toBe("2021-01-01T00:00:00.000Z");
  });

  test('should return the start and end of the day for "exclusive" comparison', () => {
    const [start, end] = getStartAndEndOfTime("2020-12-15", 0);
    expect(start).toBe("2020-12-14T23:59:59.999Z");
    expect(end).toBe("2020-12-16T00:00:00.000Z");
  });

  test("should adjust for timezone offset", () => {
    const [start, end] = getStartAndEndOfTime("2020-12-15", 9);
    expect(start).toBe("2020-12-14T14:59:59.999Z");
    expect(end).toBe("2020-12-15T15:00:00.000Z");
  });
});
