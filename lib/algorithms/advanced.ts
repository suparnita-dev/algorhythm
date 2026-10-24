import type {
  AdvancedTopic,
  AlgorithmDefinition,
  AlgorithmStep,
} from "@/types/algorithm";

export interface AdvancedAlgorithmInput {
  values?: number[];
  target?: number;
  number?: number;
  mask?: number;
}

function makeStep(
  step: number,
  description: string,
  values: number[],
  highlightedIndices: number[] = [],
  codeLine = 1
): AlgorithmStep {
  return {
    step,
    description,
    codeLine,
    array: [...values],
    highlightedIndices,
  };
}

const examples: Record<AdvancedTopic, { name: string; description: string; code: string }> = {
  recursion: {
    name: "Recursive Factorial",
    description: "Reduce the problem until the base case, then return through the call stack.",
    code: "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}",
  },
  backtracking: {
    name: "Backtracking Choices",
    description: "Explore a choice, undo it, and prune paths that cannot produce a solution.",
    code: "function choose(path, options) {\n  if (complete(path)) return;\n  for (const option of options) {\n    path.push(option);\n    choose(path, options);\n    path.pop();\n  }\n}",
  },
  "divide-and-conquer": {
    name: "Merge Sort Phases",
    description: "Divide the input, solve smaller pieces, and combine their sorted results.",
    code: "function mergeSort(values) {\n  if (values.length < 2) return values;\n  const middle = Math.floor(values.length / 2);\n  return merge(mergeSort(left), mergeSort(right));\n}",
  },
  "sorting-searching": {
    name: "Sort and Search",
    description: "Sort the input, then narrow the binary-search range around the target.",
    code: "values.sort((a, b) => a - b);\nlet left = 0;\nlet right = values.length - 1;\nwhile (left <= right) {\n  const middle = Math.floor((left + right) / 2);\n}",
  },
  greedy: {
    name: "Greedy Selection",
    description: "Take the best available local choice and continue with the remaining problem.",
    code: "for (const choice of choices) {\n  if (fits(choice)) result.push(choice);\n}",
  },
  "dynamic-programming": {
    name: "DP Table",
    description: "Store answers to smaller subproblems and reuse them in later states.",
    code: "const dp = Array(n + 1).fill(0);\nfor (let i = 1; i <= n; i++) {\n  dp[i] = dp[i - 1] + value(i);\n}",
  },
  "bit-manipulation": {
    name: "Bitwise Operations",
    description: "Inspect and transform binary digits with AND, OR, XOR, and shifts.",
    code: "const hasBit = (value & mask) !== 0;\nconst toggled = value ^ mask;\nconst shifted = value << 1;",
  },
};

function buildSteps(
  topic: AdvancedTopic,
  input: Required<AdvancedAlgorithmInput>
): AlgorithmStep[] {
  const values = input.values.length > 0 ? input.values : [1, 2, 3, 4, 5];
  const steps: AlgorithmStep[] = [];

  if (topic === "recursion") {
    const n = Math.max(0, Math.min(12, Math.trunc(input.number)));
    for (let value = n, step = 0; value >= 1; value -= 1, step += 1) {
      steps.push(makeStep(step, `Call factorial(${value}) and check whether it is the base case.`, [value], [0], value <= 1 ? 2 : 4));
    }
    steps.push(makeStep(steps.length, `Return through the call stack to calculate factorial(${n}).`, [n], [0], 4));
    return steps;
  }

  if (topic === "sorting-searching") {
    const sorted = [...values].sort((a, b) => a - b);
    let left = 0;
    let right = sorted.length - 1;
    let step = 0;
    while (left <= right) {
      const middle = Math.floor((left + right) / 2);
      steps.push(makeStep(step, `Check ${sorted[middle]} against target ${input.target}.`, sorted, [middle], 5));
      if (sorted[middle] === input.target) break;
      if (sorted[middle] < input.target) left = middle + 1;
      else right = middle - 1;
      step += 1;
    }
    steps.unshift(makeStep(0, "Sort the values before starting binary search.", sorted, [], 1));
    return steps.map((current, index) => ({ ...current, step: index }));
  }

  if (topic === "divide-and-conquer") {
    const sorted = [...values].sort((a, b) => a - b);
    return [
      makeStep(0, `Divide ${values.length} values around the midpoint.`, values, [], 3),
      makeStep(1, "Solve the left half recursively.", values, [0, Math.max(0, Math.floor(values.length / 2) - 1)], 4),
      makeStep(2, "Solve the right half recursively.", values, [Math.floor(values.length / 2), values.length - 1], 4),
      makeStep(3, "Merge the sorted halves.", sorted, sorted.map((_, index) => index), 5),
    ];
  }

  if (topic === "backtracking") {
    return values.map((value, index) =>
      makeStep(index, `Choose ${value}, explore the partial solution, then backtrack if it cannot continue.`, values, [index], index % 2 === 0 ? 4 : 6)
    );
  }

  if (topic === "greedy") {
    const sorted = [...values].sort((a, b) => b - a);
    return sorted.map((value, index) =>
      makeStep(index, `Select the highest remaining value ${value} as the next local choice.`, sorted, [index], 2)
    );
  }

  if (topic === "dynamic-programming") {
    const table = [0];
    return values.map((value, index) => {
      table.push((table[index] ?? 0) + value);
      return makeStep(index, `Reuse the previous state and compute dp[${index + 1}] = ${table[index + 1]}.`, table, [index + 1], 3);
    });
  }

  const value = Math.max(0, Math.trunc(input.number));
  const mask = Math.max(0, Math.trunc(input.mask));
  return [
    makeStep(0, `Inspect ${value} in binary and apply mask ${mask}.`, [value, mask], [0, 1], 1),
    makeStep(1, `Use AND to test whether the mask bit is present.`, [value & mask, mask], [0], 1),
    makeStep(2, `Use XOR to toggle the selected bit.`, [value ^ mask, mask], [0], 2),
    makeStep(3, `Shift the value left by one position.`, [value << 1, mask], [0], 3),
  ];
}

export function buildAdvancedAlgorithm(
  topic: AdvancedTopic,
  input: AdvancedAlgorithmInput = {}
): AlgorithmDefinition {
  const example = examples[topic];
  const normalized: Required<AdvancedAlgorithmInput> = {
    values: input.values ?? [1, 2, 3, 4, 5],
    target: input.target ?? 3,
    number: input.number ?? 5,
    mask: input.mask ?? 1,
  };
  return {
    id: topic,
    name: example.name,
    topicId: topic,
    description: example.description,
    language: "javascript",
    code: example.code,
    steps: buildSteps(topic, normalized),
  };
}
