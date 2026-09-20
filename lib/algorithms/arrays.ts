import type {
  AlgorithmDefinition,
  AlgorithmStep,
  ArrayOperation,
} from "@/types/algorithm";

export interface ArrayOperationInput {
  array: number[];
  target?: number;
  index?: number;
  value?: number;
}

/* =========================================================
   HELPER
========================================================= */

function createStep(
  step: number,
  description: string,
  array: number[],
  highlightedIndices: number[] = [],
  codeLine = 1
): AlgorithmStep {
  return {
    step,
    description,
    array: [...array],
    highlightedIndices,
    codeLine,
  };
}

/* =========================================================
   TRAVERSAL
========================================================= */

function buildTraversal(
  array: number[]
): AlgorithmDefinition {
  const steps: AlgorithmStep[] = [];

  steps.push(
    createStep(
      0,
      "Start traversal from the first element.",
      array,
      []
    )
  );

  for (let i = 0; i < array.length; i++) {
    steps.push(
      createStep(
        steps.length,
        `Visit element ${array[i]} at index ${i}.`,
        array,
        [i],
        4
      )
    );
  }

  steps.push(
    createStep(
      steps.length,
      "Traversal completed successfully.",
      array,
      []
    )
  );

  return {
    id: "array-traversal",
    name: "Array Traversal",
    topicId: "arrays",
    description:
      "Visit every element of the array sequentially.",
    language: "javascript",
    code: `const arr = [${array.join(", ")}];

for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}`,
    steps,
  };
}

/* =========================================================
   LINEAR SEARCH
========================================================= */

function buildSearch(
  array: number[],
  target: number
): AlgorithmDefinition {
  const steps: AlgorithmStep[] = [];

  steps.push(
    createStep(
      0,
      `Start linear search for ${target}.`,
      array,
      []
    )
  );

  for (let i = 0; i < array.length; i++) {
    steps.push(
      createStep(
        steps.length,
        `Compare element ${array[i]} with target ${target}.`,
        array,
        [i],
        5
      )
    );

    if (array[i] === target) {
      steps.push(
        createStep(
          steps.length,
          `Target ${target} found at index ${i}.`,
          array,
          [i],
          6
        )
      );

      return {
        id: "array-linear-search",
        name: "Linear Search",
        topicId: "arrays",
        description:
          "Search for an element by checking each array position sequentially.",
        language: "javascript",
        code: `const arr = [${array.join(", ")}];
const target = ${target};

for (let i = 0; i < arr.length; i++) {
  if (arr[i] === target) {
    console.log("Found");
    break;
  }
}`,
        steps,
      };
    }

    steps.push(
      createStep(
        steps.length,
        `${array[i]} does not match ${target}. Continue.`,
        array,
        [i],
        5
      )
    );
  }

  steps.push(
    createStep(
      steps.length,
      `Target ${target} was not found.`,
      array,
      []
    )
  );

  return {
    id: "array-linear-search",
    name: "Linear Search",
    topicId: "arrays",
    description:
      "Search for an element by checking each array position sequentially.",
    language: "javascript",
    code: `const arr = [${array.join(", ")}];
const target = ${target};

for (let i = 0; i < arr.length; i++) {
  if (arr[i] === target) {
    console.log("Found");
    break;
  }
}`,
    steps,
  };
}

/* =========================================================
   INSERTION
========================================================= */

function buildInsert(
  array: number[],
  index: number,
  value: number
): AlgorithmDefinition {
  const result = [...array];

  const safeIndex = Math.max(
    0,
    Math.min(index, result.length)
  );

  const steps: AlgorithmStep[] = [];

  steps.push(
    createStep(
      0,
      "Start with the original array.",
      result
    )
  );

  steps.push(
    createStep(
      steps.length,
      `Select index ${safeIndex} for insertion.`,
      result,
      safeIndex < result.length
        ? [safeIndex]
        : []
    )
  );

  result.push(0);

  steps.push(
    createStep(
      steps.length,
      "Create an additional position at the end.",
      result,
      [result.length - 1],
      5
    )
  );

  for (
    let i = result.length - 1;
    i > safeIndex;
    i--
  ) {
    result[i] = result[i - 1];

    steps.push(
      createStep(
        steps.length,
        `Shift ${result[i]} one position to the right.`,
        result,
        [i - 1, i],
        7
      )
    );
  }

  result[safeIndex] = value;

  steps.push(
    createStep(
      steps.length,
      `Insert ${value} at index ${safeIndex}.`,
      result,
      [safeIndex],
      10
    )
  );

  steps.push(
    createStep(
      steps.length,
      "Insertion completed.",
      result,
      [safeIndex]
    )
  );

  return {
    id: "array-insertion",
    name: "Array Insertion",
    topicId: "arrays",
    description:
      "Insert a new element by shifting existing elements to the right.",
    language: "javascript",
    code: `const arr = [${array.join(", ")}];
const index = ${safeIndex};
const value = ${value};

arr.length++;

for (let i = arr.length - 1; i > index; i--) {
  arr[i] = arr[i - 1];
}

arr[index] = value;`,
    steps,
  };
}

/* =========================================================
   DELETION
========================================================= */

function buildDelete(
  array: number[],
  index: number
): AlgorithmDefinition {
  const result = [...array];

  if (
    index < 0 ||
    index >= result.length
  ) {
    return {
      id: "array-deletion",
      name: "Array Deletion",
      topicId: "arrays",
      description:
        "Delete an element from an array.",
      language: "javascript",
      code: `const arr = [${array.join(", ")}];
const index = ${index};`,
      steps: [
        createStep(
          0,
          `Index ${index} is invalid.`,
          result
        ),
      ],
    };
  }

  const steps: AlgorithmStep[] = [];

  steps.push(
    createStep(
      0,
      "Start with the original array.",
      result
    )
  );

  steps.push(
    createStep(
      steps.length,
      `Select index ${index} for deletion.`,
      result,
      [index],
      2
    )
  );

  for (
    let i = index;
    i < result.length - 1;
    i++
  ) {
    result[i] = result[i + 1];

    steps.push(
      createStep(
        steps.length,
        `Shift element from index ${i + 1} to index ${i}.`,
        result,
        [i, i + 1],
        6
      )
    );
  }

  result.pop();

  steps.push(
    createStep(
      steps.length,
      "Remove the final duplicate element.",
      result,
      [],
      9
    )
  );

  steps.push(
    createStep(
      steps.length,
      "Deletion completed.",
      result
    )
  );

  return {
    id: "array-deletion",
    name: "Array Deletion",
    topicId: "arrays",
    description:
      "Delete an element by shifting later elements to the left.",
    language: "javascript",
    code: `const arr = [${array.join(", ")}];
const index = ${index};

for (let i = index; i < arr.length - 1; i++) {
  arr[i] = arr[i + 1];
}

arr.length--;`,
    steps,
  };
}

/* =========================================================
   UPDATE
========================================================= */

function buildUpdate(
  array: number[],
  index: number,
  value: number
): AlgorithmDefinition {
  const result = [...array];

  if (
    index < 0 ||
    index >= result.length
  ) {
    return {
      id: "array-update",
      name: "Array Update",
      topicId: "arrays",
      description:
        "Update an existing array element.",
      language: "javascript",
      code: `const arr = [${array.join(", ")}];
const index = ${index};
const value = ${value};`,
      steps: [
        createStep(
          0,
          `Index ${index} is invalid.`,
          result
        ),
      ],
    };
  }

  const oldValue = result[index];

  const steps: AlgorithmStep[] = [
    createStep(
      0,
      "Start with the original array.",
      result
    ),

    createStep(
      1,
      `Select index ${index}.`,
      result,
      [index],
      2
    ),

    createStep(
      2,
      `Replace ${oldValue} with ${value}.`,
      result,
      [index],
      5
    ),
  ];

  result[index] = value;

  steps.push(
    createStep(
      steps.length,
      `Index ${index} now contains ${value}.`,
      result,
      [index]
    )
  );

  return {
    id: "array-update",
    name: "Array Update",
    topicId: "arrays",
    description:
      "Replace an existing element at a specified index.",
    language: "javascript",
    code: `const arr = [${array.join(", ")}];
const index = ${index};
const value = ${value};

arr[index] = value;`,
    steps,
  };
}

/* =========================================================
   REVERSE
========================================================= */

function buildReverse(
  array: number[]
): AlgorithmDefinition {
  const result = [...array];

  const steps: AlgorithmStep[] = [
    createStep(
      0,
      "Start with the original array.",
      result
    ),
  ];

  let left = 0;
  let right = result.length - 1;

  while (left < right) {
    steps.push(
      createStep(
        steps.length,
        `Left pointer = ${left}, right pointer = ${right}.`,
        result,
        [left, right],
        5
      )
    );

    steps.push(
      createStep(
        steps.length,
        `Swap ${result[left]} and ${result[right]}.`,
        result,
        [left, right],
        7
      )
    );

    const temp = result[left];

    result[left] = result[right];
    result[right] = temp;

    steps.push(
      createStep(
        steps.length,
        `After swap, index ${left} contains ${result[left]} and index ${right} contains ${result[right]}.`,
        result,
        [left, right],
        7
      )
    );

    left++;
    right--;
  }

  steps.push(
    createStep(
      steps.length,
      "Array reversal completed.",
      result
    )
  );

  return {
    id: "array-reverse",
    name: "Array Reverse",
    topicId: "arrays",
    description:
      "Reverse an array using the two-pointer technique.",
    language: "javascript",
    code: `const arr = [${array.join(", ")}];

let left = 0;
let right = arr.length - 1;

while (left < right) {
  [arr[left], arr[right]] =
    [arr[right], arr[left]];

  left++;
  right--;
}`,
    steps,
  };
}

/* =========================================================
   MAIN PUBLIC FUNCTION
========================================================= */

export function buildArrayAlgorithm(
  operation: ArrayOperation,
  input: ArrayOperationInput
): AlgorithmDefinition {
  const array =
    input.array.length > 0
      ? [...input.array]
      : [10, 20, 30, 40, 50];

  switch (operation) {
    case "traverse":
      return buildTraversal(array);

    case "search":
      return buildSearch(
        array,
        input.target ?? 30
      );

    case "insert":
      return buildInsert(
        array,
        input.index ?? 0,
        input.value ?? 0
      );

    case "delete":
      return buildDelete(
        array,
        input.index ?? 0
      );

    case "update":
      return buildUpdate(
        array,
        input.index ?? 0,
        input.value ?? 0
      );

    case "reverse":
      return buildReverse(array);

    default:
      return buildTraversal(array);
  }
}

/* =========================================================
   DEFAULT / COMPATIBILITY API
========================================================= */

export function getArrayAlgorithm(
  operation: ArrayOperation
): AlgorithmDefinition {
  return buildArrayAlgorithm(
    operation,
    {
      array: [
        10,
        20,
        30,
        40,
        50,
      ],
      target: 30,
      index: 2,
      value: 25,
    }
  );
}

export const arrayTraversalAlgorithm =
  buildTraversal([
    10,
    20,
    30,
    40,
    50,
  ]);