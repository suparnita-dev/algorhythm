import type {
  AlgorithmDefinition,
  AlgorithmStep,
} from "@/types/algorithm";

/* =========================================================
   TYPES
========================================================= */

export type StringOperation =
  | "traverse"
  | "search"
  | "reverse"
  | "palindrome"
  | "frequency"
  | "anagram"
  | "replace";

export interface StringOperationInput {
  text: string;
  target?: string;
  replacement?: string;
}

/* =========================================================
   HELPERS
========================================================= */

function createStep(
  step: number,
  description: string,
  text: string,
  highlightedIndices: number[] = [],
  codeLine = 1
): AlgorithmStep {
  return {
    step,
    description,
    array: [...text],
    highlightedIndices,
    codeLine,
  };
}

/* =========================================================
   STRING TRAVERSAL
========================================================= */

function buildTraversal(
  text: string
): AlgorithmDefinition {
  const steps: AlgorithmStep[] = [];

  steps.push(
    createStep(
      0,
      "Start traversing the string from the first character.",
      text,
      []
    )
  );

  for (let i = 0; i < text.length; i++) {
    steps.push(
      createStep(
        steps.length,
        `Visit character "${text[i]}" at index ${i}.`,
        text,
        [i],
        4
      )
    );
  }

  steps.push(
    createStep(
      steps.length,
      "String traversal completed.",
      text
    )
  );

  return {
    id: "string-traversal",
    name: "String Traversal",
    topicId: "strings",
    description:
      "Visit every character of a string from left to right.",
    language: "javascript",
    code: `const text = "${text}";

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}`,
    steps,
  };
}

/* =========================================================
   STRING SEARCH
========================================================= */

function buildSearch(
  text: string,
  target: string
): AlgorithmDefinition {
  const steps: AlgorithmStep[] = [];

  if (!target) {
    return {
      id: "string-search",
      name: "String Search",
      topicId: "strings",
      description:
        "Search for a substring inside a string.",
      language: "javascript",
      code: `const text = "${text}";
const target = "";`,
      steps: [
        createStep(
          0,
          "The search target is empty.",
          text
        ),
      ],
    };
  }

  steps.push(
    createStep(
      0,
      `Search for "${target}" inside the string.`,
      text
    )
  );

  const maxStart =
    text.length - target.length;

  for (let i = 0; i <= maxStart; i++) {
    const indices = Array.from(
      { length: target.length },
      (_, offset) => i + offset
    );

    steps.push(
      createStep(
        steps.length,
        `Compare substring starting at index ${i}.`,
        text,
        indices,
        5
      )
    );

    const candidate =
      text.slice(
        i,
        i + target.length
      );

    if (candidate === target) {
      steps.push(
        createStep(
          steps.length,
          `Found "${target}" starting at index ${i}.`,
          text,
          indices,
          7
        )
      );

      return {
        id: "string-search",
        name: "String Search",
        topicId: "strings",
        description:
          "Find the first occurrence of a substring using a straightforward search.",
        language: "javascript",
        code: `const text = "${text}";
const target = "${target}";

for (
  let i = 0;
  i <= text.length - target.length;
  i++
) {
  if (
    text.substring(
      i,
      i + target.length
    ) === target
  ) {
    console.log(i);
    break;
  }
}`,
        steps,
      };
    }

    steps.push(
      createStep(
        steps.length,
        `"${candidate}" does not match "${target}".`,
        text,
        indices,
        6
      )
    );
  }

  steps.push(
    createStep(
      steps.length,
      `"${target}" was not found.`,
      text
    )
  );

  return {
    id: "string-search",
    name: "String Search",
    topicId: "strings",
    description:
      "Find the first occurrence of a substring using a straightforward search.",
    language: "javascript",
    code: `const text = "${text}";
const target = "${target}";

for (
  let i = 0;
  i <= text.length - target.length;
  i++
) {
  if (
    text.substring(
      i,
      i + target.length
    ) === target
  ) {
    console.log(i);
    break;
  }
}`,
    steps,
  };
}

/* =========================================================
   REVERSE STRING
========================================================= */

function buildReverse(
  text: string
): AlgorithmDefinition {
  const chars = [...text];

  const steps: AlgorithmStep[] = [
    createStep(
      0,
      "Start with the original string.",
      text
    ),
  ];

  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    steps.push(
      createStep(
        steps.length,
        `Compare left index ${left} with right index ${right}.`,
        chars.join(""),
        [left, right],
        5
      )
    );

    const temp = chars[left];
    chars[left] = chars[right];
    chars[right] = temp;

    steps.push(
      createStep(
        steps.length,
        `Swap characters at indices ${left} and ${right}.`,
        chars.join(""),
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
      `Reversed string: "${chars.join("")}".`,
      chars.join("")
    )
  );

  return {
    id: "string-reverse",
    name: "Reverse String",
    topicId: "strings",
    description:
      "Reverse a string using the two-pointer technique.",
    language: "javascript",
    code: `const chars =
  "${text}".split("");

let left = 0;
let right =
  chars.length - 1;

while (left < right) {
  [
    chars[left],
    chars[right]
  ] = [
    chars[right],
    chars[left]
  ];

  left++;
  right--;
}

console.log(chars.join(""));`,
    steps,
  };
}

/* =========================================================
   PALINDROME
========================================================= */

function buildPalindrome(
  text: string
): AlgorithmDefinition {
  const chars = [...text];

  const steps: AlgorithmStep[] = [
    createStep(
      0,
      "Start palindrome checking with two pointers.",
      text
    ),
  ];

  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    steps.push(
      createStep(
        steps.length,
        `Compare "${chars[left]}" and "${chars[right]}".`,
        text,
        [left, right],
        6
      )
    );

    if (
      chars[left].toLowerCase() !==
      chars[right].toLowerCase()
    ) {
      steps.push(
        createStep(
          steps.length,
          `Characters do not match. "${text}" is not a palindrome.`,
          text,
          [left, right],
          8
        )
      );

      return {
        id: "string-palindrome",
        name: "Palindrome Check",
        topicId: "strings",
        description:
          "Determine whether a string reads the same from both directions.",
        language: "javascript",
        code: `const text = "${text}";

let left = 0;
let right = text.length - 1;

let isPalindrome = true;

while (left < right) {
  if (
    text[left].toLowerCase() !==
    text[right].toLowerCase()
  ) {
    isPalindrome = false;
    break;
  }

  left++;
  right--;
}

console.log(isPalindrome);`,
        steps,
      };
    }

    steps.push(
      createStep(
        steps.length,
        "Characters match. Move both pointers inward.",
        text,
        [left, right],
        10
      )
    );

    left++;
    right--;
  }

  steps.push(
    createStep(
      steps.length,
      `"${text}" is a palindrome.`,
      text
    )
  );

  return {
    id: "string-palindrome",
    name: "Palindrome Check",
    topicId: "strings",
    description:
      "Determine whether a string reads the same from both directions.",
    language: "javascript",
    code: `const text = "${text}";

let left = 0;
let right = text.length - 1;

let isPalindrome = true;

while (left < right) {
  if (
    text[left].toLowerCase() !==
    text[right].toLowerCase()
  ) {
    isPalindrome = false;
    break;
  }

  left++;
  right--;
}

console.log(isPalindrome);`,
    steps,
  };
}

/* =========================================================
   FREQUENCY COUNT
========================================================= */

function buildFrequency(
  text: string
): AlgorithmDefinition {
  const frequency: Record<string, number> = {};

  const steps: AlgorithmStep[] = [
    createStep(
      0,
      "Create an empty frequency table.",
      text
    ),
  ];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    frequency[char] =
      (frequency[char] ?? 0) + 1;

    steps.push(
      createStep(
        steps.length,
        `Character "${char}" appears ${frequency[char]} time(s).`,
        text,
        [i],
        6
      )
    );
  }

  steps.push(
    createStep(
      steps.length,
      "Frequency counting completed.",
      text
    )
  );

  return {
    id: "string-frequency",
    name: "Character Frequency",
    topicId: "strings",
    description:
      "Count how many times each character appears in a string.",
    language: "javascript",
    code: `const text = "${text}";
const frequency = {};

for (
  let i = 0;
  i < text.length;
  i++
) {
  const char = text[i];

  frequency[char] =
    (frequency[char] ?? 0) + 1;
}

console.log(frequency);`,
    steps,
  };
}

/* =========================================================
   ANAGRAM
========================================================= */

function buildAnagram(
  text: string,
  target: string
): AlgorithmDefinition {
  const steps: AlgorithmStep[] = [];

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/\s/g, "");

  const first = normalize(text);
  const second = normalize(target);

  steps.push(
    createStep(
      0,
      `Compare "${text}" and "${target}" as normalized strings.`,
      text
    )
  );

  if (first.length !== second.length) {
    steps.push(
      createStep(
        steps.length,
        "The strings have different lengths, so they cannot be anagrams.",
        text
      )
    );

    return {
      id: "string-anagram",
      name: "Anagram Check",
      topicId: "strings",
      description:
        "Determine whether two strings contain the same characters with the same frequencies.",
      language: "javascript",
      code: `const first = "${text}"
  .toLowerCase()
  .replace(/\\s/g, "");

const second = "${target}"
  .toLowerCase()
  .replace(/\\s/g, "");

console.log(
  first.length === second.length
);`,
      steps,
    };
  }

  const frequency: Record<string, number> = {};

  for (let i = 0; i < first.length; i++) {
    const char = first[i];

    frequency[char] =
      (frequency[char] ?? 0) + 1;

    steps.push(
      createStep(
        steps.length,
        `Count "${char}" from the first string.`,
        text,
        [Math.min(i, text.length - 1)],
        5
      )
    );
  }

  for (let i = 0; i < second.length; i++) {
    const char = second[i];

    frequency[char] =
      (frequency[char] ?? 0) - 1;

    steps.push(
      createStep(
        steps.length,
        `Remove "${char}" using the second string.`,
        text,
        [Math.min(i, text.length - 1)],
        9
      )
    );
  }

  const isAnagram =
    Object.values(frequency).every(
      (count) => count === 0
    );

  steps.push(
    createStep(
      steps.length,
      isAnagram
        ? `"${text}" and "${target}" are anagrams.`
        : `"${text}" and "${target}" are not anagrams.`,
      text
    )
  );

  return {
    id: "string-anagram",
    name: "Anagram Check",
    topicId: "strings",
    description:
      "Determine whether two strings contain the same characters with the same frequencies.",
    language: "javascript",
    code: `const first = "${text}"
  .toLowerCase()
  .replace(/\\s/g, "");

const second = "${target}"
  .toLowerCase()
  .replace(/\\s/g, "");

const frequency = {};

for (const char of first) {
  frequency[char] =
    (frequency[char] ?? 0) + 1;
}

for (const char of second) {
  frequency[char] =
    (frequency[char] ?? 0) - 1;
}

const result =
  Object.values(frequency)
    .every(count => count === 0);

console.log(result);`,
    steps,
  };
}

/* =========================================================
   STRING REPLACE
========================================================= */

function buildReplace(
  text: string,
  target: string,
  replacement: string
): AlgorithmDefinition {
  const steps: AlgorithmStep[] = [
    createStep(
      0,
      `Search for "${target}" inside the string.`,
      text
    ),
  ];

  if (!target) {
    steps.push(
      createStep(
        steps.length,
        "The target cannot be empty.",
        text
      )
    );

    return {
      id: "string-replace",
      name: "String Replace",
      topicId: "strings",
      description:
        "Replace occurrences of one substring with another.",
      language: "javascript",
      code: `const text = "${text}";
const target = "";
const replacement = "${replacement}";`,
      steps,
    };
  }

  let current = text;
  let position = current.indexOf(target);

  while (position !== -1) {
    const highlighted = Array.from(
      { length: target.length },
      (_, offset) =>
        position + offset
    );

    steps.push(
      createStep(
        steps.length,
        `Found "${target}" at index ${position}.`,
        current,
        highlighted,
        5
      )
    );

    current =
      current.slice(0, position) +
      replacement +
      current.slice(
        position + target.length
      );

    steps.push(
      createStep(
        steps.length,
        `Replace "${target}" with "${replacement}".`,
        current,
        [],
        7
      )
    );

    position = current.indexOf(
      target,
      position + replacement.length
    );
  }

  steps.push(
    createStep(
      steps.length,
      "String replacement completed.",
      current
    )
  );

  return {
    id: "string-replace",
    name: "String Replace",
    topicId: "strings",
    description:
      "Replace occurrences of a substring with another string.",
    language: "javascript",
    code: `const text = "${text}";
const target = "${target}";
const replacement = "${replacement}";

const result =
  text.replaceAll(
    target,
    replacement
  );

console.log(result);`,
    steps,
  };
}

/* =========================================================
   MAIN BUILDER
========================================================= */

export function buildStringAlgorithm(
  operation: StringOperation,
  input: StringOperationInput
): AlgorithmDefinition {
  const text =
    input.text || "algorithm";

  switch (operation) {
    case "traverse":
      return buildTraversal(text);

    case "search":
      return buildSearch(
        text,
        input.target ?? "go"
      );

    case "reverse":
      return buildReverse(text);

    case "palindrome":
      return buildPalindrome(text);

    case "frequency":
      return buildFrequency(text);

    case "anagram":
      return buildAnagram(
        text,
        input.target ?? "logarithm"
      );

    case "replace":
      return buildReplace(
        text,
        input.target ?? "a",
        input.replacement ?? "X"
      );

    default:
      return buildTraversal(text);
  }
}

/* =========================================================
   COMPATIBILITY API
========================================================= */

export function getStringAlgorithm(
  operation: StringOperation
): AlgorithmDefinition {
  return buildStringAlgorithm(
    operation,
    {
      text: "algorithm",
      target: "go",
      replacement: "X",
    }
  );
}

/* =========================================================
   DEFAULT ALGORITHM
========================================================= */

export const stringTraversalAlgorithm =
  buildTraversal("algorithm");