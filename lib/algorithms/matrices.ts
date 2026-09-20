import type {
  AlgorithmDefinition,
  AlgorithmStep,
  MatrixOperation,
} from "@/types/algorithm";

export interface MatrixOperationInput {
  matrix: number[][];
  target?: number;
}

function copyMatrix(matrix: number[][]) {
  return matrix.map((row) => [...row]);
}

function createStep(
  step: number,
  description: string,
  matrix: number[][],
  highlightedCells: [number, number][] = [],
  codeLine = 1
): AlgorithmStep {
  return {
    step,
    description,
    codeLine,
    array: matrix.flat(),
    highlightedIndices: highlightedCells.map(
      ([row, column]) => row * matrix[0].length + column
    ),
    matrix: copyMatrix(matrix),
    highlightedCells,
  };
}

function definition(
  id: string,
  name: string,
  description: string,
  code: string,
  steps: AlgorithmStep[]
): AlgorithmDefinition {
  return {
    id,
    name,
    topicId: "matrices",
    description,
    language: "javascript",
    code,
    steps,
  };
}

function buildTraversal(matrix: number[][]): AlgorithmDefinition {
  const steps = [createStep(0, "Start matrix traversal.", matrix)];

  matrix.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      steps.push(
        createStep(
          steps.length,
          `Visit matrix value ${value} at row ${rowIndex}, column ${columnIndex}.`,
          matrix,
          [[rowIndex, columnIndex]],
          5
        )
      );
    });
  });

  steps.push(createStep(steps.length, "Matrix traversal completed.", matrix));

  return definition(
    "matrix-traversal",
    "Matrix Traversal",
    "Visit every matrix cell row by row.",
    `const matrix = ${JSON.stringify(matrix)};

for (let row = 0; row < matrix.length; row++) {
  for (let column = 0; column < matrix[row].length; column++) {
    console.log(matrix[row][column]);
  }
}`,
    steps
  );
}

function buildSearch(matrix: number[][], target: number): AlgorithmDefinition {
  const steps = [
    createStep(0, `Start searching for ${target}.`, matrix),
  ];

  for (let row = 0; row < matrix.length; row++) {
    for (let column = 0; column < matrix[row].length; column++) {
      const cell = [row, column] as [number, number];
      steps.push(
        createStep(
          steps.length,
          `Compare ${matrix[row][column]} with target ${target}.`,
          matrix,
          [cell],
          6
        )
      );

      if (matrix[row][column] === target) {
        steps.push(
          createStep(
            steps.length,
            `Target ${target} found at row ${row}, column ${column}.`,
            matrix,
            [cell],
            7
          )
        );

        return definition(
          "matrix-search",
          "Matrix Search",
          "Search for a value by checking each matrix cell.",
          `const matrix = ${JSON.stringify(matrix)};
const target = ${target};`,
          steps
        );
      }
    }
  }

  steps.push(createStep(steps.length, `Target ${target} was not found.`, matrix));

  return definition(
    "matrix-search",
    "Matrix Search",
    "Search for a value by checking each matrix cell.",
    `const matrix = ${JSON.stringify(matrix)};
const target = ${target};`,
    steps
  );
}

function buildTranspose(matrix: number[][]): AlgorithmDefinition {
  const result = matrix[0].map((_, column) =>
    matrix.map((row) => row[column])
  );
  const steps = [createStep(0, "Start with the original matrix.", matrix)];

  for (let row = 0; row < matrix.length; row++) {
    for (let column = row + 1; column < matrix[0].length; column++) {
      steps.push(
        createStep(
          steps.length,
          `Transpose the value at row ${row}, column ${column}.`,
          matrix,
          [[row, column]],
          5
        )
      );
    }
  }

  steps.push(createStep(steps.length, "Matrix transposed successfully.", result));

  return definition(
    "matrix-transpose",
    "Matrix Transpose",
    "Swap matrix rows and columns to create its transpose.",
    `const matrix = ${JSON.stringify(matrix)};
const transposed = matrix[0].map((_, column) =>
  matrix.map((row) => row[column])
);`,
    steps
  );
}

export function buildMatrixAlgorithm(
  operation: MatrixOperation,
  input: MatrixOperationInput
): AlgorithmDefinition {
  const matrix = input.matrix.length > 0 ? input.matrix : [[0]];

  if (operation === "search") {
    return buildSearch(matrix, input.target ?? 0);
  }

  if (operation === "transpose") {
    return buildTranspose(matrix);
  }

  return buildTraversal(matrix);
}