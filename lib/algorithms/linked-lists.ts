import type {
  AlgorithmDefinition,
  AlgorithmStep,
  LinkedListOperation,
  LinkedListVariant,
} from "@/types/algorithm";

export interface LinkedListOperationInput {
  values: number[];
  variant: LinkedListVariant;
  target?: number;
  index?: number;
  value?: number;
}

function createStep(
  step: number,
  description: string,
  values: number[],
  variant: LinkedListVariant,
  highlightedIndices: number[] = [],
  codeLine = 1
): AlgorithmStep {
  return {
    step,
    description,
    codeLine,
    array: [...values],
    highlightedIndices,
    linkedList: {
      variant,
      values: [...values],
      highlightedIndices,
    },
  };
}

function listName(variant: LinkedListVariant) {
  return variant === "singly"
    ? "Singly Linked List"
    : variant === "doubly"
      ? "Doubly Linked List"
      : "Circular Linked List";
}

function definition(
  variant: LinkedListVariant,
  operation: LinkedListOperation,
  code: string,
  steps: AlgorithmStep[]
): AlgorithmDefinition {
  const name = listName(variant);
  return {
    id: `linked-list-${variant}-${operation}`,
    name: `${name} ${operation[0].toUpperCase()}${operation.slice(1)}`,
    topicId: "linked-lists",
    description: `Explore ${operation} in a ${name.toLowerCase()}.`,
    language: "javascript",
    code,
    steps,
  };
}

function buildTraversal(
  values: number[],
  variant: LinkedListVariant
): AlgorithmDefinition {
  const steps = [
    createStep(0, `Start at the head of the ${listName(variant).toLowerCase()}.`, values, variant),
  ];

  values.forEach((value, index) => {
    steps.push(
      createStep(
        steps.length,
        `Visit node ${value} at position ${index}. Follow its next pointer.`,
        values,
        variant,
        [index],
        5
      )
    );
  });

  steps.push(
    createStep(
      steps.length,
      variant === "circular"
        ? "The tail points back to the head; traversal stops after one cycle."
        : "The next pointer is null; traversal is complete.",
      values,
      variant
    )
  );

  return definition(
    variant,
    "traverse",
    `let current = head;
while (current !== null) {
  console.log(current.value);
  current = current.next;
}`,
    steps
  );
}

function buildSearch(
  values: number[],
  variant: LinkedListVariant,
  target: number
): AlgorithmDefinition {
  const steps = [
    createStep(0, `Search the list for ${target}.`, values, variant),
  ];

  for (let index = 0; index < values.length; index++) {
    steps.push(
      createStep(
        steps.length,
        `Compare node ${values[index]} with target ${target}.`,
        values,
        variant,
        [index],
        5
      )
    );

    if (values[index] === target) {
      steps.push(
        createStep(
          steps.length,
          `Target ${target} found at position ${index}.`,
          values,
          variant,
          [index],
          6
        )
      );
      return definition(variant, "search", `let current = head;
while (current !== null) {
  if (current.value === ${target}) break;
  current = current.next;
}`, steps);
    }
  }

  steps.push(createStep(steps.length, `Target ${target} was not found.`, values, variant));
  return definition(variant, "search", `let current = head;
while (current !== null) {
  if (current.value === ${target}) break;
  current = current.next;
}`, steps);
}

function buildInsert(
  values: number[],
  variant: LinkedListVariant,
  index: number,
  value: number
): AlgorithmDefinition {
  const result = [...values];
  const safeIndex = Math.max(0, Math.min(index, result.length));
  const steps = [createStep(0, "Create a new node for insertion.", values, variant)];

  if (safeIndex > 0) {
    steps.push(createStep(steps.length, `Walk to node ${safeIndex - 1}.`, values, variant, [safeIndex - 1], 4));
  }

  result.splice(safeIndex, 0, value);
  steps.push(createStep(steps.length, `Link the new node ${value} at position ${safeIndex}.`, result, variant, [safeIndex], 7));
  steps.push(createStep(steps.length, "Insertion completed; update head or tail when needed.", result, variant, [safeIndex]));

  return definition(variant, "insert", `const node = new Node(${value});
// Connect the new node at index ${safeIndex}
current.next = node;`, steps);
}

function buildDelete(
  values: number[],
  variant: LinkedListVariant,
  index: number
): AlgorithmDefinition {
  const result = [...values];
  if (index < 0 || index >= result.length) {
    return definition(variant, "delete", `const index = ${index};`, [
      createStep(0, `Position ${index} is invalid.`, values, variant),
    ]);
  }

  const steps = [createStep(0, `Locate node at position ${index}.`, values, variant, [index], 3)];
  result.splice(index, 1);
  steps.push(createStep(steps.length, "Reconnect the neighboring pointers around the removed node.", result, variant, index < result.length ? [index] : [], 6));
  steps.push(createStep(steps.length, "Deletion completed; update head or tail when needed.", result, variant));

  return definition(variant, "delete", `// Bypass the node at index ${index}
previous.next = current.next;`, steps);
}

function buildReverse(
  values: number[],
  variant: LinkedListVariant
): AlgorithmDefinition {
  const result = [...values];
  const steps = [createStep(0, "Start reversing the links from the head.", result, variant)];

  for (let index = 0; index < Math.floor(result.length / 2); index++) {
    const other = result.length - 1 - index;
    [result[index], result[other]] = [result[other], result[index]];
    steps.push(createStep(steps.length, `Reverse the link between positions ${index} and ${other}.`, result, variant, [index, other], 5));
  }

  steps.push(createStep(steps.length, "The list is reversed; head and tail are exchanged.", result, variant));
  return definition(variant, "reverse", `let previous = null;
let current = head;
while (current !== null) {
  const next = current.next;
  current.next = previous;
  previous = current;
  current = next;
}`, steps);
}

export function buildLinkedListAlgorithm(
  operation: LinkedListOperation,
  input: LinkedListOperationInput
): AlgorithmDefinition {
  const values = input.values.length > 0 ? input.values : [10, 20, 30, 40];

  if (operation === "search") {
    return buildSearch(values, input.variant, input.target ?? 20);
  }
  if (operation === "insert") {
    return buildInsert(values, input.variant, input.index ?? 1, input.value ?? 25);
  }
  if (operation === "delete") {
    return buildDelete(values, input.variant, input.index ?? 1);
  }
  if (operation === "reverse") {
    return buildReverse(values, input.variant);
  }
  return buildTraversal(values, input.variant);
}