import { describe, expect, it } from "vitest";

import { getTaskProgressColor, type TaskProgressState } from "./taskProgress";

const now = new Date("2026-03-28T12:00:00.000Z");

const baseTask: TaskProgressState = {
  dueOn: new Date("2026-03-28T16:00:00.000Z"),
  startOn: new Date("2026-03-28T10:00:00.000Z"),
  finishedOn: null,
  confirmedAsFinished: false,
};

describe("getTaskProgressColor", () => {
  it("returns null when dueOn is missing", () => {
    const result = getTaskProgressColor({ ...baseTask, dueOn: null }, now);

    expect(result).toBeNull();
  });

  it("returns danger for overdue unfinished task", () => {
    const result = getTaskProgressColor(
      {
        ...baseTask,
        dueOn: new Date("2026-03-28T11:00:00.000Z"),
      },
      now,
    );

    expect(result).toBe("danger");
  });

  it("returns warning when task is nearing deadline", () => {
    const result = getTaskProgressColor(
      {
        ...baseTask,
        startOn: new Date("2026-03-28T00:00:00.000Z"),
        dueOn: new Date("2026-03-28T13:00:00.000Z"),
      },
      now,
    );

    expect(result).toBe("warning");
  });

  it("returns success for confirmed completed task", () => {
    const result = getTaskProgressColor(
      {
        ...baseTask,
        confirmedAsFinished: true,
        finishedOn: new Date("2026-03-28T11:00:00.000Z"),
      },
      now,
    );

    expect(result).toBe("success");
  });

  it("returns primary for active task not near deadline", () => {
    const result = getTaskProgressColor(baseTask, now);

    expect(result).toBe("primary");
  });
});