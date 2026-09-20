export type SupportedLanguage =
  | "javascript"
  | "python"
  | "cpp";

export type ArrayOperation =
  | "traverse"
  | "search"
  | "insert"
  | "delete"
  | "update"
  | "reverse";

export type MatrixOperation =
  | "traverse"
  | "search"
  | "transpose";

export type LinkedListVariant =
  | "singly"
  | "doubly"
  | "circular";

export type LinkedListOperation =
  | "traverse"
  | "search"
  | "insert"
  | "delete"
  | "reverse";

export type StructureTopic =
  | "stacks"
  | "queues"
  | "trees"
  | "graphs";

export type StructureOperation =
  | "traverse"
  | "push"
  | "pop"
  | "peek"
  | "enqueue"
  | "dequeue"
  | "bfs"
  | "dfs";

export type BigOOperation =
  | "constant"
  | "logarithmic"
  | "linear"
  | "linearithmic"
  | "quadratic";

export type AdvancedTopic =
  | "recursion"
  | "backtracking"
  | "divide-and-conquer"
  | "sorting-searching"
  | "greedy"
  | "dynamic-programming"
  | "bit-manipulation";

export type AdvancedOperation = "run";

export interface AlgorithmStep {
  step: number;
  description: string;
  codeLine: number;
  array: (number | string)[];
  highlightedIndices: number[];
  matrix?: number[][];
  highlightedCells?: [number, number][];
  linkedList?: {
    variant: LinkedListVariant;
    values: number[];
    highlightedIndices: number[];
  };
  structure?: {
    kind: StructureTopic;
    values: number[];
    edges?: [number, number][];
    highlightedIndices: number[];
  };
}

export interface AlgorithmDefinition {
  id: string;
  name: string;
  topicId: string;
  description: string;
  language: SupportedLanguage;
  code: string;
  steps: AlgorithmStep[];
}