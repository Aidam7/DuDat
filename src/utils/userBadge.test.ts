import { describe, expect, it } from "vitest";

import { getUserTaskBadge } from "./userBadge";

describe("getUserTaskBadge", () => {
  it("returns null when user has no finished tasks", () => {
    const result = getUserTaskBadge({
      finishedTasksCount: 0,
      finishedTasksLateCount: 0,
    });

    expect(result).toBeNull();
  });

  it("returns best badge when no task was finished late", () => {
    const result = getUserTaskBadge({
      finishedTasksCount: 8,
      finishedTasksLateCount: 0,
    });

    expect(result).toBe("🤩 Finished all tasks on time");
  });

  it("returns almost-all-on-time badge below 25 percent late", () => {
    const result = getUserTaskBadge({
      finishedTasksCount: 9,
      finishedTasksLateCount: 2,
    });

    expect(result).toBe("🥳 Finished almost all tasks on time");
  });

  it("returns mid-tier badge at 40 percent late", () => {
    const result = getUserTaskBadge({
      finishedTasksCount: 3,
      finishedTasksLateCount: 2,
    });

    expect(result).toBe("👌 Finished most tasks on time");
  });

  it("returns worst badge when all tasks were finished late", () => {
    const result = getUserTaskBadge({
      finishedTasksCount: 0,
      finishedTasksLateCount: 5,
    });

    expect(result).toBe("😞 Finished no tasks on time");
  });
});