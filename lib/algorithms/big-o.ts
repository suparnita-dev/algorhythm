import type {
  AlgorithmDefinition,
  AlgorithmStep,
  BigOOperation,
} from "@/types/algorithm";

const labels: Record<BigOOperation, string> = {
  constant: "O(1)",
  logarithmic: "O(log n)",
  linear: "O(n)",
  linearithmic: "O(n log n)",
  quadratic: "O(n²)",
};

function buildSteps(operation: BigOOperation, size: number): AlgorithmStep[] {
  const count = Math.max(1, Math.min(size, 12));
  const steps: AlgorithmStep[] = [];
  const values = Array.from({ length: count }, (_, index) => index + 1);
  const visits = operation === "constant"
    ? [0]
    : operation === "logarithmic"
      ? [0, Math.floor(count / 2), count - 1]
      : operation === "linear"
        ? values.map((_, index) => index)
        : operation === "linearithmic"
          ? values.map((_, index) => index).concat(values.map((_, index) => index))
          : values.flatMap((_, outer) => values.map((_, inner) => outer === inner ? outer : -1)).filter((index) => index >= 0);

  visits.forEach((index, stepIndex) => {
    const safeIndex = Math.min(index, count - 1);
    steps.push({
      step: stepIndex,
      description: `${labels[operation]}: perform work for input size ${count}. Visit ${operation === "quadratic" ? `pair ${stepIndex + 1}` : `position ${safeIndex + 1}`}.`,
      codeLine: operation === "constant" ? 2 : operation === "quadratic" ? 5 : 3,
      array: values,
      highlightedIndices: [safeIndex],
    });
  });

  return steps;
}

export function buildBigOAlgorithm(
  operation: BigOOperation,
  size: number
): AlgorithmDefinition {
  const label = labels[operation];
  return {
    id: `big-o-${operation}`,
    name: `${label} Growth`,
    topicId: "big-o",
    description: `Visualize how ${label} work grows as input size increases.`,
    language: "javascript",
    code: operation === "constant"
      ? "const first = values[0];"
      : operation === "logarithmic"
        ? "while (n > 1) n = Math.floor(n / 2);"
        : operation === "linear"
          ? "for (const value of values) visit(value);"
          : operation === "linearithmic"
            ? "values.sort();\nfor (const value of values) visit(value);"
            : "for (const left of values) {\n  for (const right of values) visit(left, right);\n}",
    steps: buildSteps(operation, size),
  };
}