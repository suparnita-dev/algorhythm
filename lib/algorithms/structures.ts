import type {
  AlgorithmDefinition,
  AlgorithmStep,
  StructureOperation,
  StructureTopic,
} from "@/types/algorithm";

export interface StructureInput {
  kind: StructureTopic;
  values: number[];
  value?: number;
  edges?: [number, number][];
}

function step(
  number: number,
  description: string,
  input: StructureInput,
  highlightedIndices: number[] = [],
  codeLine = 1
): AlgorithmStep {
  return {
    step: number,
    description,
    codeLine,
    array: [...input.values],
    highlightedIndices,
    structure: {
      kind: input.kind,
      values: [...input.values],
      edges: input.kind === "graphs" || input.kind === "trees" ? input.edges : undefined,
      highlightedIndices,
    },
  };
}

function definition(
  kind: StructureTopic,
  operation: StructureOperation,
  code: string,
  steps: AlgorithmStep[]
): AlgorithmDefinition {
  const names: Record<StructureTopic, string> = {
    stacks: "Stack",
    queues: "Queue",
    trees: "Binary Tree",
    graphs: "Graph",
  };
  return {
    id: `${kind}-${operation}`,
    name: `${names[kind]} ${operation.toUpperCase()}`,
    topicId: kind,
    description: `Step through ${operation} on a ${names[kind].toLowerCase()}.`,
    language: "javascript",
    code,
    steps,
  };
}

function linearOperation(input: StructureInput, operation: StructureOperation) {
  const values = [...input.values];
  const steps = [step(0, `Start with ${input.kind === "stacks" ? "the stack" : "the queue"}.`, input)];

  if (operation === "push" || operation === "enqueue") {
    const value = input.value ?? 50;
    values.push(value);
    steps.push(step(steps.length, `${operation === "push" ? "Push" : "Enqueue"} ${value} at the ${operation === "push" ? "top" : "rear"}.`, { ...input, values }, [values.length - 1], 4));
  } else if (operation === "pop" || operation === "dequeue") {
    const index = operation === "pop" ? values.length - 1 : 0;
    const removed = values[index];
    steps.push(step(steps.length, `${operation === "pop" ? "Pop" : "Dequeue"} ${removed} from the ${operation === "pop" ? "top" : "front"}.`, input, [index], 4));
    values.splice(index, 1);
    steps.push(step(steps.length, "Update the structure after removal.", { ...input, values }, []));
  } else if (operation === "peek") {
    const index = input.kind === "stacks" ? values.length - 1 : 0;
    steps.push(step(steps.length, `Peek reads ${values[index]} without removing it.`, input, [index], 4));
  } else {
    values.forEach((value, index) => steps.push(step(steps.length, `Visit ${value} in ${input.kind === "stacks" ? "top-to-bottom" : "front-to-rear"} order.`, input, [index], 5)));
  }

  return definition(input.kind, operation, `const structure = [${input.values.join(", ")}];
// Perform ${operation} according to ${input.kind === "stacks" ? "LIFO" : "FIFO"}.`, steps);
}

function treeTraversal(input: StructureInput, operation: StructureOperation) {
  const steps = [step(0, "Start at the root node of the binary tree.", input)];
  const order = operation === "traverse"
    ? input.values.map((_, index) => index)
    : input.values.map((_, index) => index);
  order.forEach((index) => steps.push(step(steps.length, `Visit tree node ${input.values[index]} during ${operation === "traverse" ? "inorder" : "level-order"} traversal.`, input, [index], 5)));
  return definition("trees", operation, `function traverse(node) {
  if (!node) return;
  traverse(node.left);
  console.log(node.value);
  traverse(node.right);
}`, steps);
}

function graphTraversal(input: StructureInput, operation: StructureOperation) {
  const steps = [step(0, `Start ${operation.toUpperCase()} from vertex ${input.values[0]}.`, input)];
  const adjacency = input.values.map(() => [] as number[]);
  input.edges?.forEach(([from, to]) => {
    adjacency[from]?.push(to);
    adjacency[to]?.push(from);
  });
  const order: number[] = [];
  const visited = new Set<number>();
  const worklist = [0];
  while (worklist.length > 0) {
    const current = operation === "bfs" ? worklist.shift()! : worklist.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);
    order.push(current);
    const neighbors = adjacency[current] ?? [];
    if (operation === "dfs") {
      worklist.push(...[...neighbors].reverse());
    } else {
      worklist.push(...neighbors);
    }
  }
  input.values.forEach((_, index) => {
    if (!visited.has(index)) order.push(index);
  });
  order.forEach((index) => steps.push(step(steps.length, `Visit vertex ${input.values[index]} and inspect its edges.`, input, [index], 5)));
  return definition("graphs", operation, `const visited = new Set();
const worklist = [0];
while (worklist.length) {
  const vertex = worklist.shift();
  visited.add(vertex);
}`, steps);
}

export function buildStructureAlgorithm(
  operation: StructureOperation,
  input: StructureInput
): AlgorithmDefinition {
  if (input.kind === "trees") return treeTraversal(input, operation);
  if (input.kind === "graphs") return graphTraversal(input, operation);
  return linearOperation(input, operation);
}