import { describe, expect, it } from "vitest";

import { buildArrayAlgorithm } from "@/lib/algorithms/arrays";
import { buildAdvancedAlgorithm } from "@/lib/algorithms/advanced";
import { buildBigOAlgorithm } from "@/lib/algorithms/big-o";
import { buildLinkedListAlgorithm } from "@/lib/algorithms/linked-lists";
import { buildMatrixAlgorithm } from "@/lib/algorithms/matrices";
import { buildStringAlgorithm } from "@/lib/algorithms/strings";
import {
  createUser,
  hashPassword,
  setSessionCookie,
  userFromSession,
  verifyPassword,
} from "@/lib/server/auth";

function expectValidSteps(steps: { step: number; array: unknown[]; codeLine: number }[]) {
  expect(steps.length).toBeGreaterThan(0);
  expect(steps.map((step) => step.step)).toEqual(
    Array.from({ length: steps.length }, (_, index) => index)
  );
  expect(steps.every((step) => step.codeLine > 0)).toBe(true);
  expect(steps.every((step) => Array.isArray(step.array))).toBe(true);
}

describe("algorithm step builders", () => {
  it("builds immutable array reverse snapshots, including duplicates and negatives", () => {
    const input = [-2, 4, 4, 9];
    const algorithm = buildArrayAlgorithm("reverse", { array: input });

    expectValidSteps(algorithm.steps);
    expect(algorithm.steps.at(-1)?.array).toEqual([9, 4, 4, -2]);
    expect(input).toEqual([-2, 4, 4, 9]);
  });

  it("uses a safe default for empty string input", () => {
    const algorithm = buildStringAlgorithm("search", { text: "", target: "x" });

    expectValidSteps(algorithm.steps);
    expect(algorithm.steps.at(-1)?.description.toLowerCase()).toContain("not found");
    expect(algorithm.steps.at(-1)?.array).toEqual(["a", "l", "g", "o", "r", "i", "t", "h", "m"]);
  });

  it("preserves rectangular matrix snapshots through transpose", () => {
    const algorithm = buildMatrixAlgorithm("transpose", {
      matrix: [[1, 2, 3], [4, 5, 6]],
    });

    expectValidSteps(algorithm.steps);
    expect(algorithm.steps.at(-1)?.matrix).toEqual([[1, 4], [2, 5], [3, 6]]);
  });

  it("supports linked-list edge indexes without mutating input", () => {
    const values = [10, 20, 30];
    const algorithm = buildLinkedListAlgorithm("insert", {
      values,
      variant: "singly",
      index: 99,
      value: -5,
    });

    expectValidSteps(algorithm.steps);
    expect(algorithm.steps.at(-1)?.linkedList?.values).toContain(-5);
    expect(values).toEqual([10, 20, 30]);
  });

  it("models every pair for quadratic Big O instead of only the diagonal", () => {
    const algorithm = buildBigOAlgorithm("quadratic", 3);

    expect(algorithm.steps).toHaveLength(9);
    expect(algorithm.steps.every((step) => step.highlightedIndices.length === 2)).toBe(true);
  });

  it("uses learner-provided inputs for advanced topics", () => {
    const recursion = buildAdvancedAlgorithm("recursion", { number: 3 });
    const search = buildAdvancedAlgorithm("sorting-searching", {
      values: [9, 1, 5],
      target: 5,
    });
    const bits = buildAdvancedAlgorithm("bit-manipulation", { number: 10, mask: 2 });

    expect(recursion.steps.some((step) => step.description.includes("factorial(3)"))).toBe(true);
    expect(search.steps.some((step) => step.description.includes("target 5"))).toBe(true);
    expect(bits.steps.at(-1)?.array[0]).toBe(20);
  });
});

describe("demo authentication", () => {
  it("hashes passwords and rejects tampered sessions", async () => {
    const passwordHash = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("correct horse battery staple", passwordHash)).toBe(true);
    expect(await verifyPassword("wrong password", passwordHash)).toBe(false);

    const user = createUser({
      name: "Test User",
      email: `test-${Date.now()}@example.com`,
      passwordHash,
    });
    const response = new Response();
    setSessionCookie(response, user.id);
    const cookie = response.headers.get("set-cookie");
    const token = cookie?.match(/algocraft_session=([^;]+)/)?.[1];

    expect(userFromSession(token)?.id).toBe(user.id);
    expect(userFromSession(`${token}tampered`)).toBeUndefined();
  });
});
