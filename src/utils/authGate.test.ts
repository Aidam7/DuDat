import { describe, expect, it } from "vitest";

import { resolveAuthGateState } from "./authGate";

describe("resolveAuthGateState", () => {
  it("returns children on index page regardless of status", () => {
    const result = resolveAuthGateState("/", "unauthenticated");

    expect(result).toBe("children");
  });

  it("returns loading for route with loading status", () => {
    const result = resolveAuthGateState("/tasks", "loading");

    expect(result).toBe("loading");
  });

  it("returns signIn for route with unauthenticated status", () => {
    const result = resolveAuthGateState("/tasks", "unauthenticated");

    expect(result).toBe("signIn");
  });

  it("returns children for route with authenticated status", () => {
    const result = resolveAuthGateState("/tasks", "authenticated");

    expect(result).toBe("children");
  });

  it("returns error for unknown status on route", () => {
    const result = resolveAuthGateState("/tasks", "unknown-status");

    expect(result).toBe("error");
  });
});