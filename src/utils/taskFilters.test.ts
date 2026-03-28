import { describe, expect, it } from "vitest";

import { splitTasksByState } from "./taskFilters";

interface MockTask {
  id: string;
  finishedOn: Date | null;
  confirmedAsFinished: boolean;
}

describe("splitTasksByState", () => {
  it("places unfinished tasks into ongoing", () => {
    const tasks: MockTask[] = [
      { id: "1", finishedOn: null, confirmedAsFinished: false },
      { id: "2", finishedOn: new Date("2026-03-01"), confirmedAsFinished: true },
    ];

    const { ongoing } = splitTasksByState(tasks);

    expect(ongoing.map((task) => task.id)).toEqual(["1"]);
  });

  it("places only finished and confirmed tasks into finished", () => {
    const tasks: MockTask[] = [
      { id: "1", finishedOn: new Date("2026-03-01"), confirmedAsFinished: true },
      { id: "2", finishedOn: new Date("2026-03-02"), confirmedAsFinished: false },
      { id: "3", finishedOn: null, confirmedAsFinished: false },
    ];

    const { finished } = splitTasksByState(tasks);

    expect(finished.map((task) => task.id)).toEqual(["1"]);
  });

  it("returns empty buckets for undefined input", () => {
    const { finished, ongoing } = splitTasksByState(undefined);

    expect(finished).toEqual([]);
    expect(ongoing).toEqual([]);
  });

  it("returns empty buckets for null input", () => {
    const { finished, ongoing } = splitTasksByState(null);

    expect(finished).toEqual([]);
    expect(ongoing).toEqual([]);
  });
});