import type {
  AdvancedTopic,
  AlgorithmDefinition,
  AlgorithmStep,
} from "@/types/algorithm";

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
    description: "Compare neighboring values while sorting, then narrow the search range.",
    code: "values.sort((a, b) => a - b);\nlet left = 0;\nlet right = values.length - 1;",
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

function buildSteps(topic: AdvancedTopic): AlgorithmStep[] {
  const values = topic === "bit-manipulation" ? [5, 3, 1, 0] : [1, 2, 3, 4, 5];
  const descriptions: Record<AdvancedTopic, string[]> = {
    recursion: ["Call factorial(5).", "Reduce to factorial(4).", "Reduce to factorial(3).", "Reach the base case.", "Return values through the call stack."],
    backtracking: ["Choose the first candidate.", "Move deeper with the current choice.", "Reject an invalid partial solution.", "Undo the choice and try the next candidate.", "Keep the complete valid path."],
    "divide-and-conquer": ["Divide the input into two halves.", "Recursively solve the left half.", "Recursively solve the right half.", "Merge two sorted halves.", "The combined result is sorted."],
    "sorting-searching": ["Compare two values.", "Swap values that are out of order.", "Narrow the binary-search range.", "Check the middle value.", "The target position is determined."],
    greedy: ["Sort choices by their local benefit.", "Select the best choice that fits.", "Update the remaining capacity.", "Skip a choice that violates the constraint.", "The greedy result is complete."],
    "dynamic-programming": ["Define the initial state.", "Fill the next subproblem.", "Reuse a previously computed state.", "Apply the state transition.", "The final state contains the answer."],
    "bit-manipulation": ["Read the binary representation.", "Apply bitwise AND with a mask.", "Toggle bits with XOR.", "Shift bits to the left.", "The transformed bit pattern is ready."],
  };
  return descriptions[topic].map((description, index) => makeStep(index, description, values, [index % values.length], index + 1));
}

export function buildAdvancedAlgorithm(
  topic: AdvancedTopic
): AlgorithmDefinition {
  const example = examples[topic];
  return {
    id: topic,
    name: example.name,
    topicId: topic,
    description: example.description,
    language: "javascript",
    code: example.code,
    steps: buildSteps(topic),
  };
}