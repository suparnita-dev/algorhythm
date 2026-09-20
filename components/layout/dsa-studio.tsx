"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleUserRound,
  Eye,
  EyeOff,
  LockKeyhole,
  MessageCircle,
  Moon,
  Send,
  Sparkles,
  ShieldCheck,
  Sun,
  Trophy,
  X,
  Zap,
} from "lucide-react";

import {
  buildArrayAlgorithm,
} from "@/lib/algorithms/arrays";
import {
  buildStringAlgorithm,
} from "@/lib/algorithms/strings";
import {
  buildMatrixAlgorithm,
} from "@/lib/algorithms/matrices";
import {
  buildLinkedListAlgorithm,
} from "@/lib/algorithms/linked-lists";
import {
  buildStructureAlgorithm,
} from "@/lib/algorithms/structures";
import {
  buildBigOAlgorithm,
} from "@/lib/algorithms/big-o";
import {
  buildAdvancedAlgorithm,
} from "@/lib/algorithms/advanced";

import type {
  AlgorithmDefinition,
  AlgorithmStep,
  AdvancedTopic,
  ArrayOperation,
  BigOOperation,
  MatrixOperation,
  LinkedListOperation,
  LinkedListVariant,
  StructureOperation,
  StructureTopic,
} from "@/types/algorithm";

import type {
  StringOperation,
  StringOperationInput,
} from "@/lib/algorithms/strings";

import VisualizationCanvas from "@/components/visualization/visualization-canvas";

/* =========================================================
   DEFAULT ARRAY
========================================================= */

const DEFAULT_ARRAY = [
  10,
  20,
  30,
  40,
  50,
];

const TOPIC_GUIDES: Record<string, { definition: string; parts: string[]; details: string[]; complexity: string }> = {
  arrays: {
    definition: "An ordered collection stored in contiguous memory and accessed by index.",
    parts: ["index", "element", "length", "contiguous storage"],
    details: [
      "Arrays place values next to one another in memory, so the address of any element can be calculated from its index. This makes direct lookup fast and predictable.",
      "Reading or updating arr[i] is usually O(1). Inserting or deleting near the beginning can be O(n) because later elements may need to shift.",
      "Use arrays when you need fast indexing, compact storage, or repeated scans. Keep the valid index range from 0 through length - 1.",
    ],
    complexity: "Access O(1) | Search O(n) | Insert/Delete O(n)",
  },
  strings: {
    definition: "An ordered sequence of characters used to represent and process text.",
    parts: ["characters", "indices", "length", "encoding"],
    details: [
      "A string is an ordered sequence, so every character has a position. Algorithms often scan it from left to right while maintaining a count, window, or matching state.",
      "Common tasks include comparison, reversal, frequency counting, substring search, palindrome checks, and parsing. Be aware that some languages treat strings as immutable.",
      "Choose a builder or character array when repeated edits would create many temporary strings.",
    ],
    complexity: "Indexing O(1) in many runtimes | Scan O(n) | Pattern search varies",
  },
  matrices: {
    definition: "A rectangular grid of values organized by rows and columns.",
    parts: ["rows", "columns", "cells", "dimensions"],
    details: [
      "A matrix uses two coordinates: row and column. Its dimensions are commonly written as rows x columns, and a cell is addressed as matrix[row][column].",
      "Traversal can be row-major, column-major, spiral, diagonal, or boundary-based. Always check the dimensions before using a neighbor or transposing a matrix.",
      "Matrices model images, game boards, tables, adjacency relationships, and dynamic-programming states.",
    ],
    complexity: "Visit every cell O(rows x columns) | Transpose O(rows x columns)",
  },
  "linked-lists": {
    definition: "A chain of nodes where each node stores data and one or more links.",
    parts: ["node", "value", "head", "tail", "next", "prev in doubly lists"],
    details: [
      "Linked lists trade direct indexing for flexible connections. The head identifies the first node, while the tail identifies the final node when one is tracked.",
      "Singly linked nodes point forward, doubly linked nodes point forward and backward, and circular lists connect the tail back to the head.",
      "Insertion is efficient after a known node, but finding that position usually requires traversal from the head.",
    ],
    complexity: "Access/Search O(n) | Insert/Delete after node O(1) | Extra links O(n)",
  },
  stacks: {
    definition: "A LIFO structure where the most recently added item leaves first.",
    parts: ["top", "push", "pop", "peek", "underflow"],
    details: [
      "A stack has one active end called the top. Push adds an item there, pop removes the top item, and peek reads it without changing the stack.",
      "The call stack uses the same idea to track active function calls. Stacks are also useful for undo histories, parsing, depth-first search, and backtracking.",
      "Popping or peeking an empty stack causes underflow, so check emptiness before removal.",
    ],
    complexity: "Push/Pop/Peek O(1) | Storage O(n)",
  },
  queues: {
    definition: "A FIFO structure where the earliest added item leaves first.",
    parts: ["front", "rear", "enqueue", "dequeue", "underflow"],
    details: [
      "A queue separates the insertion end, called the rear, from the removal end, called the front. Enqueue adds at the rear and dequeue removes from the front.",
      "Queues model waiting lines, task scheduling, buffering, and breadth-first search. Circular queues reuse freed positions instead of shifting every item.",
      "A deque supports both-end operations, while a priority queue removes according to priority rather than arrival time.",
    ],
    complexity: "Enqueue/Dequeue/Front O(1) with pointers | Storage O(n)",
  },
  trees: {
    definition: "A hierarchical structure of nodes connected from a root to child nodes.",
    parts: ["root", "parent", "child", "leaf", "depth", "height"],
    details: [
      "A tree begins at one root and branches downward. Every node except the root has one parent; a leaf has no children. Depth counts edges from the root, while height measures the longest path below a node.",
      "Binary trees allow at most two children. Preorder visits node-left-right, inorder visits left-node-right, postorder visits left-right-node, and level order uses a queue.",
      "Balanced trees keep height small and make search, insertion, and deletion more predictable than a highly skewed tree.",
    ],
    complexity: "Traversal O(n) | Balanced search O(log n) | Skewed search O(n)",
  },
  graphs: {
    definition: "A network of vertices connected by edges that model relationships.",
    parts: ["vertex", "edge", "neighbor", "path", "direction", "weight"],
    details: [
      "Vertices represent entities and edges represent relationships. Edges may be directed or undirected, weighted or unweighted, and may form cycles.",
      "An adjacency list is memory-efficient for sparse graphs; an adjacency matrix gives O(1) edge lookup but uses O(V²) space.",
      "BFS explores layer by layer and is useful for shortest unweighted paths. DFS follows a branch deeply and supports cycle detection, components, and backtracking.",
    ],
    complexity: "Adjacency list traversal O(V + E) | Matrix storage O(V²)",
  },
  "big-o": {
    definition: "A notation for describing how an algorithm's time or memory grows with input size.",
    parts: ["input size n", "time complexity", "space complexity", "best case", "average case", "worst case"],
    details: [
      "Big O focuses on growth as n becomes large. Constants and smaller terms are usually omitted, so 3n + 10 is described as O(n).",
      "Time complexity measures work; space complexity measures extra memory. Best, average, and worst cases describe how input arrangement changes the cost.",
      "Use complexity to compare scalable approaches, but also consider actual constants, memory locality, input limits, and the operation the application values most.",
    ],
    complexity: "Common growth: O(1), O(log n), O(n), O(n log n), O(n²)",
  },
  recursion: {
    definition: "A technique where a function solves a problem by calling itself on a smaller problem.",
    parts: ["base case", "recursive case", "call stack", "progress"],
    details: [
      "A recursive function has a base case that stops the process and a recursive case that moves toward it. Without both, the call stack can grow forever.",
      "Each call receives its own local state. The calls pause until the smaller problem returns, then resolve in reverse order through the call stack.",
      "Recursion is natural for trees and divide-and-conquer problems, but an iterative version may use less stack memory.",
    ],
    complexity: "Depends on branching and depth | Stack space follows recursion depth",
  },
  backtracking: {
    definition: "A search strategy that explores choices, undoes them, and prunes invalid paths.",
    parts: ["choice", "constraint", "state", "undo", "pruning"],
    details: [
      "Backtracking builds a partial solution one decision at a time. When a constraint fails, it undoes the last decision and tries another branch.",
      "The search is often represented as a decision tree. Pruning is the key optimization: reject impossible branches before exploring them fully.",
      "Typical examples include permutations, subsets, maze solving, Sudoku, and N-Queens.",
    ],
    complexity: "Often exponential; pruning can reduce the practical search space",
  },
  "divide-and-conquer": {
    definition: "A strategy that divides a problem, solves smaller parts, and combines their results.",
    parts: ["divide", "conquer", "combine", "subproblem", "recurrence"],
    details: [
      "Divide and conquer separates a large problem into smaller independent problems, solves them recursively, and combines their results.",
      "The recurrence describes the cost of the split and combine phases. Merge sort is a classic example because each level processes all n values.",
      "The approach is often easy to parallelize because independent subproblems can be solved at the same time.",
    ],
    complexity: "Merge sort O(n log n) time | Recursion space commonly O(log n)",
  },
  "sorting-searching": {
    definition: "Techniques for ordering values and efficiently locating a target value.",
    parts: ["comparison", "ordering", "search range", "target", "invariant"],
    details: [
      "Sorting arranges values according to an order. Searching uses structure in the data to avoid unnecessary comparisons.",
      "Linear search works on unsorted data. Binary search requires sorted data and repeatedly halves the remaining range.",
      "When choosing a sorting algorithm, compare time, extra memory, stability, and whether the data is already partially ordered.",
    ],
    complexity: "Linear search O(n) | Binary search O(log n) | Efficient comparison sort O(n log n)",
  },
  greedy: {
    definition: "An approach that repeatedly chooses the best available local option.",
    parts: ["greedy choice", "feasibility", "local optimum", "global result", "proof"],
    details: [
      "A greedy algorithm commits to the best-looking available choice without revisiting earlier decisions.",
      "Greedy reasoning is correct only when the problem has the right exchange property or proof that local choices lead to an optimal global result.",
      "Activity selection, interval scheduling, Huffman coding, and minimum spanning trees are common examples.",
    ],
    complexity: "Often O(n log n) when sorting choices dominates",
  },
  "dynamic-programming": {
    definition: "An optimization method that stores and reuses answers to overlapping subproblems.",
    parts: ["state", "transition", "base case", "memoization", "tabulation"],
    details: [
      "Dynamic programming applies when subproblems overlap and an optimal solution is built from optimal smaller solutions.",
      "Memoization stores results during top-down recursion; tabulation fills a table from known base states upward.",
      "The hardest design step is defining the state and transition. Draw a few small cases before writing the full table.",
    ],
    complexity: "Usually states x transitions; extra memory is often proportional to the state table",
  },
  "bit-manipulation": {
    definition: "Techniques that directly inspect and transform the binary digits of numbers.",
    parts: ["binary digits", "mask", "AND", "OR", "XOR", "shift"],
    details: [
      "Bit manipulation treats an integer as a collection of binary flags. Masks select, set, clear, or toggle particular positions.",
      "AND tests or clears bits, OR sets bits, XOR toggles bits, and shifts move the pattern left or right. Parentheses make mixed expressions safer to read.",
      "Bit operations are useful for compact flags, permissions, parity, subsets, and low-level performance work.",
    ],
    complexity: "Individual bitwise operations are typically O(1) on fixed-width integers",
  },
};

const QUIZ_QUESTIONS = [
  {
    topic: "Arrays",
    question: "Why can an array access arr[i] in constant time?",
    options: [
      "Elements are stored at predictable contiguous offsets.",
      "Arrays always use a hash table.",
      "The array scans from the first element each time.",
      "Every element has a pointer to every other element.",
    ],
    answer: 0,
    explanation: "The index and element size let the runtime calculate the address directly.",
  },
  {
    topic: "Graphs",
    question: "Which traversal explores an unweighted graph level by level?",
    options: ["DFS", "BFS", "Inorder", "Quicksort"],
    answer: 1,
    explanation: "BFS uses a queue and visits all vertices at the current distance before moving deeper.",
  },
  {
    topic: "Dynamic Programming",
    question: "What makes a problem a good DP candidate?",
    options: ["Only one possible input", "Overlapping subproblems and optimal substructure", "No base case", "Random access only"],
    answer: 1,
    explanation: "DP reuses answers to overlapping subproblems to construct an optimal larger solution.",
  },
  {
    topic: "Stacks",
    question: "Which rule describes a stack?",
    options: ["FIFO", "LIFO", "Random access only", "Sorted first"],
    answer: 1,
    explanation: "A stack is last-in, first-out: the newest item is removed first.",
  },
  {
    topic: "Big O",
    question: "What is the growth rate of binary search on sorted data?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    answer: 1,
    explanation: "Binary search halves the remaining search range after each comparison.",
  },
  {
    topic: "Trees",
    question: "What is a leaf in a tree?",
    options: ["The root node", "A node with no children", "Any node with two parents", "The tallest level"],
    answer: 1,
    explanation: "A leaf is a node with no child nodes.",
  },
  {
    topic: "Recursion",
    question: "What prevents a recursive function from calling forever?",
    options: ["A hash map", "A base case", "A queue", "A sort operation"],
    answer: 1,
    explanation: "The base case stops further recursive calls.",
  },
  {
    topic: "Greedy Algorithms",
    question: "What does a greedy algorithm choose at each step?",
    options: ["The best local option", "Every possible solution", "The deepest recursion", "A random option"],
    answer: 0,
    explanation: "Greedy algorithms commit to the best feasible local choice.",
  },
  {
    topic: "Linked Lists",
    question: "What does a linked-list node usually contain?",
    options: ["Only an index", "A value and one or more links", "A matrix", "A sorting algorithm"],
    answer: 1,
    explanation: "Nodes store data plus links to neighboring nodes.",
  },
  {
    topic: "Bit Manipulation",
    question: "Which operator toggles bits?",
    options: ["AND", "OR", "XOR", "Division"],
    answer: 2,
    explanation: "XOR flips a bit when the corresponding mask bit is 1.",
  },
];

function formatTopicTitle(topic: string) {
  return topic
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/* =========================================================
   COMPONENT
========================================================= */

export default function DSAStudio() {
  const [topic, setTopic] =
    useState<"arrays" | "strings" | "matrices" | "linked-lists" | "big-o" | StructureTopic | AdvancedTopic>("arrays");

  const [arrayOperation, setArrayOperation] =
    useState<ArrayOperation>("traverse");

  const [stringOperation, setStringOperation] =
    useState<StringOperation>("traverse");

  const [matrixOperation, setMatrixOperation] =
    useState<MatrixOperation>("traverse");

  const [linkedListOperation, setLinkedListOperation] =
    useState<LinkedListOperation>("traverse");

  const [linkedListVariant, setLinkedListVariant] =
    useState<LinkedListVariant>("singly");

  const [structureOperation, setStructureOperation] =
    useState<StructureOperation>("traverse");

  const [bigOOperation, setBigOOperation] =
    useState<BigOOperation>("linear");

  const [arrayInput, setArrayInput] =
    useState(DEFAULT_ARRAY.join(", "));

  const [target, setTarget] =
    useState("30");

  const [index, setIndex] =
    useState("2");

  const [value, setValue] =
    useState("25");

  const [stringInput, setStringInput] =
    useState("algorithm");

  const [stringTarget, setStringTarget] =
    useState("go");

  const [matrixInput, setMatrixInput] =
    useState("1, 2, 3; 4, 5, 6; 7, 8, 9");

  const [replacement, setReplacement] =
    useState("X");

  const [matrixTarget, setMatrixTarget] =
    useState("5");

  const [linkedListInput, setLinkedListInput] =
    useState("10, 20, 30, 40");

  const [linkedListTarget, setLinkedListTarget] =
    useState("20");

  const [structureValue, setStructureValue] =
    useState("50");

  const [inputSize, setInputSize] =
    useState("8");

  const [currentStep, setCurrentStep] =
    useState(0);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [speed, setSpeed] =
    useState(700);

  const [isSignedIn, setIsSignedIn] =
    useState(false);

  const [hasStarted, setHasStarted] =
    useState(false);

  const [isBooting, setIsBooting] =
    useState(true);

  const [isDarkMode, setIsDarkMode] =
    useState(false);

  const [completedTopics, setCompletedTopics] =
    useState<string[]>([]);

  const [quizBestScore, setQuizBestScore] =
    useState(0);

  const [quizAttempts, setQuizAttempts] =
    useState(0);

  const [authOpen, setAuthOpen] =
    useState(false);

  const [profileName, setProfileName] =
    useState("Alex Morgan");

  const [profileEmail, setProfileEmail] =
    useState("alex@example.com");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [authMode, setAuthMode] =
    useState<"signin" | "signup">("signin");

  const [authError, setAuthError] =
    useState("");

  const [authPending, setAuthPending] =
    useState(false);

  const [quizOpen, setQuizOpen] =
    useState(false);

  const [quizIndex, setQuizIndex] =
    useState(0);

  const [quizAnswer, setQuizAnswer] =
    useState<number | null>(null);

  const [quizScore, setQuizScore] =
    useState(0);

  const [quizComplete, setQuizComplete] =
    useState(false);

  const [tutorInput, setTutorInput] =
    useState("");

  const [tutorMessages, setTutorMessages] =
    useState([
      {
        role: "tutor",
        text: "Welcome back. I can explain the current step, compare complexities, or give you a hint.",
      },
    ]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 10000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedTheme = window.localStorage.getItem("algorhythm_theme");
      const savedName = window.localStorage.getItem("algorhythm_name");
      const savedEmail = window.localStorage.getItem("algorhythm_email");
      const savedTopics = window.localStorage.getItem("algorhythm_completed_topics");
      const savedBestScore = window.localStorage.getItem("algorhythm_quiz_best");
      const savedAttempts = window.localStorage.getItem("algorhythm_quiz_attempts");

      if (savedTheme === "dark") setIsDarkMode(true);
      if (savedName) setProfileName(savedName);
      if (savedEmail) setProfileEmail(savedEmail);
      if (savedTopics) setCompletedTopics(JSON.parse(savedTopics) as string[]);
      if (savedBestScore) setQuizBestScore(Number(savedBestScore));
      if (savedAttempts) setQuizAttempts(Number(savedAttempts));

      fetch("/api/auth/me")
        .then((response) => {
          if (response.ok) setIsSignedIn(true);
        })
        .catch(() => undefined);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("algorhythm_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    window.localStorage.setItem("algorhythm_name", profileName);
    window.localStorage.setItem("algorhythm_email", profileEmail);
    window.localStorage.setItem("algorhythm_completed_topics", JSON.stringify(completedTopics));
    window.localStorage.setItem("algorhythm_quiz_best", String(quizBestScore));
    window.localStorage.setItem("algorhythm_quiz_attempts", String(quizAttempts));
  }, [profileName, profileEmail, completedTopics, quizBestScore, quizAttempts]);


  /* =======================================================
     PARSE ARRAY
  ======================================================= */

  const parsedArray = useMemo(() => {
    const values = arrayInput
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));

    return values.length > 0
      ? values
      : DEFAULT_ARRAY;
  }, [arrayInput]);

  const parsedMatrix = useMemo(() => {
    const rows = matrixInput.split(";").map((row) =>
      row
        .split(",")
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isFinite(item))
    );
    const width = rows[0]?.length ?? 0;
    const isValid = width > 0 && rows.every((row) => row.length === width);

    return isValid ? rows : [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  }, [matrixInput]);

  const parsedLinkedList = useMemo(() => {
    const values = linkedListInput
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));

    return values.length > 0 ? values : [10, 20, 30, 40];
  }, [linkedListInput]);

  /* =======================================================
     BUILD ALGORITHM
  ======================================================= */

  const algorithm: AlgorithmDefinition =
    useMemo(() => {
      if (topic === "strings") {
        const input: StringOperationInput = {
          text: stringInput,
          target: stringTarget,
          replacement,
        };

        return buildStringAlgorithm(
          stringOperation,
          input
        );
      }

      if (topic === "matrices") {
        return buildMatrixAlgorithm(
          matrixOperation,
          {
            matrix: parsedMatrix,
            target: Number(matrixTarget),
          }
        );
      }

      if (topic === "linked-lists") {
        return buildLinkedListAlgorithm(
          linkedListOperation,
          {
            values: parsedLinkedList,
            variant: linkedListVariant,
            target: Number(linkedListTarget),
            index: Number(index),
            value: Number(value),
          }
        );
      }

      if (
        topic === "stacks" ||
        topic === "queues" ||
        topic === "trees" ||
        topic === "graphs"
      ) {
        return buildStructureAlgorithm(
          structureOperation,
          {
            kind: topic,
            values: topic === "trees"
              ? [8, 4, 12, 2, 6, 10, 14]
              : topic === "graphs"
                ? [1, 2, 3, 4, 5, 6]
                : parsedLinkedList,
            value: Number(structureValue),
          }
        );
      }

      if (topic === "big-o") {
        return buildBigOAlgorithm(bigOOperation, Number(inputSize));
      }

      if (
        topic === "recursion" ||
        topic === "backtracking" ||
        topic === "divide-and-conquer" ||
        topic === "sorting-searching" ||
        topic === "greedy" ||
        topic === "dynamic-programming" ||
        topic === "bit-manipulation"
      ) {
        return buildAdvancedAlgorithm(topic);
      }

      return buildArrayAlgorithm(
        arrayOperation,
        {
          array: parsedArray,
          target: Number(target),
          index: Number(index),
          value: Number(value),
        }
      );
    }, [
      topic,
      arrayOperation,
      stringOperation,
      matrixOperation,
      linkedListOperation,
      linkedListVariant,
      structureOperation,
      bigOOperation,
      parsedArray,
      target,
      index,
      value,
      stringInput,
      stringTarget,
      replacement,
      parsedMatrix,
      matrixTarget,
      parsedLinkedList,
      linkedListTarget,
      structureValue,
      inputSize,
    ]);

  /* =======================================================
     CURRENT STEP
  ======================================================= */

  const currentAlgorithmStep: AlgorithmStep =
    algorithm.steps[
      Math.min(
        currentStep,
        algorithm.steps.length - 1
      )
    ];

  const totalTopics = 16;
  const completedCount = completedTopics.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalTopics) * 100));

  useEffect(() => {
    if (currentStep < algorithm.steps.length - 1) return;
    const timer = window.setTimeout(() => {
      setCompletedTopics((topics) => topics.includes(topic) ? topics : [...topics, topic]);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [algorithm.steps.length, currentStep, topic]);

  /* =======================================================
     NEXT STEP
  ======================================================= */

  const nextStep = useCallback(() => {
    setCurrentStep((previous) => {
      if (
        previous >=
        algorithm.steps.length - 1
      ) {
        setIsPlaying(false);
        return previous;
      }

      return previous + 1;
    });
  }, [algorithm.steps.length]);

  /* =======================================================
     PREVIOUS STEP
  ======================================================= */

  const previousStep = useCallback(() => {
    setCurrentStep((previous) =>
      Math.max(previous - 1, 0)
    );
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowRight") nextStep();
      if (event.key === "ArrowLeft") previousStep();
      if (event.key === " ") {
        event.preventDefault();
        setIsPlaying((playing) => !playing);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [nextStep, previousStep]);

  /* =======================================================
     RESET
  ======================================================= */

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  /* =======================================================
     CHANGE OPERATION
  ======================================================= */

  const changeArrayOperation = (
    nextOperation: ArrayOperation
  ) => {
    setIsPlaying(false);
    setCurrentStep(0);
    setArrayOperation(nextOperation);
  };

  const changeStringOperation = (
    nextOperation: StringOperation
  ) => {
    setIsPlaying(false);
    setCurrentStep(0);
    setStringOperation(nextOperation);
  };

  const changeMatrixOperation = (
    nextOperation: MatrixOperation
  ) => {
    setIsPlaying(false);
    setCurrentStep(0);
    setMatrixOperation(nextOperation);
  };

  const changeLinkedListOperation = (
    nextOperation: LinkedListOperation
  ) => {
    setIsPlaying(false);
    setCurrentStep(0);
    setLinkedListOperation(nextOperation);
  };

  const changeStructureOperation = (
    nextOperation: StructureOperation
  ) => {
    setIsPlaying(false);
    setCurrentStep(0);
    setStructureOperation(nextOperation);
  };

  const changeBigOOperation = (nextOperation: BigOOperation) => {
    setIsPlaying(false);
    setCurrentStep(0);
    setBigOOperation(nextOperation);
  };

  /* =======================================================
     PLAYBACK
  ======================================================= */

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentStep((previous) => {
        if (previous >= algorithm.steps.length - 1) {
          setIsPlaying(false);
          return previous;
        }

        return previous + 1;
      });
    }, speed);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    isPlaying,
    currentStep,
    algorithm.steps.length,
    speed,
  ]);

  /* =======================================================
     OPERATION BUTTONS
  ======================================================= */

  const arrayOperations: {
    id: ArrayOperation;
    label: string;
  }[] = [
    {
      id: "traverse",
      label: "Traverse",
    },
    {
      id: "search",
      label: "Search",
    },
    {
      id: "insert",
      label: "Insert",
    },
    {
      id: "delete",
      label: "Delete",
    },
    {
      id: "update",
      label: "Update",
    },
    {
      id: "reverse",
      label: "Reverse",
    },
  ];

  const stringOperations: {
    id: StringOperation;
    label: string;
  }[] = [
    { id: "traverse", label: "Traverse" },
    { id: "search", label: "Search" },
    { id: "reverse", label: "Reverse" },
    { id: "palindrome", label: "Palindrome" },
    { id: "frequency", label: "Frequency" },
    { id: "anagram", label: "Anagram" },
    { id: "replace", label: "Replace" },
  ];

  const matrixOperations: {
    id: MatrixOperation;
    label: string;
  }[] = [
    { id: "traverse", label: "Traverse" },
    { id: "search", label: "Search" },
    { id: "transpose", label: "Transpose" },
  ];

  const linkedListOperations: {
    id: LinkedListOperation;
    label: string;
  }[] = [
    { id: "traverse", label: "Traverse" },
    { id: "search", label: "Search" },
    { id: "insert", label: "Insert" },
    { id: "delete", label: "Delete" },
    { id: "reverse", label: "Reverse" },
  ];

  const structureOperations: Record<StructureTopic, { id: StructureOperation; label: string }[]> = {
    stacks: [
      { id: "push", label: "Push" },
      { id: "pop", label: "Pop" },
      { id: "peek", label: "Peek" },
      { id: "traverse", label: "Traverse" },
    ],
    queues: [
      { id: "enqueue", label: "Enqueue" },
      { id: "dequeue", label: "Dequeue" },
      { id: "peek", label: "Front / Peek" },
      { id: "traverse", label: "Traverse" },
    ],
    trees: [{ id: "traverse", label: "Tree Traversal" }],
    graphs: [
      { id: "bfs", label: "BFS" },
      { id: "dfs", label: "DFS" },
    ],
  };

  const bigOOperations: { id: BigOOperation; label: string }[] = [
    { id: "constant", label: "O(1) Constant" },
    { id: "logarithmic", label: "O(log n) Logarithmic" },
    { id: "linear", label: "O(n) Linear" },
    { id: "linearithmic", label: "O(n log n) Linearithmic" },
    { id: "quadratic", label: "O(n²) Quadratic" },
  ];

  const advancedOperations: { id: "run"; label: string }[] = [
    { id: "run", label: "Run Example" },
  ];

  const operation =
    topic === "arrays"
      ? arrayOperation
      : topic === "strings"
        ? stringOperation
        : topic === "matrices"
          ? matrixOperation
          : topic === "linked-lists"
            ? linkedListOperation
            : topic === "big-o"
              ? bigOOperation
              : topic === "recursion" ||
                  topic === "backtracking" ||
                  topic === "divide-and-conquer" ||
                  topic === "sorting-searching" ||
                  topic === "greedy" ||
                  topic === "dynamic-programming" ||
                  topic === "bit-manipulation"
                ? "run"
                : structureOperation;

  const sendTutorMessage = async () => {
    const prompt = tutorInput.trim();
    if (!prompt) return;

    setTutorMessages((messages) => [
      ...messages,
      { role: "learner", text: prompt },
    ]);
    setTutorInput("");

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          topic,
          step: currentAlgorithmStep.description,
        }),
      });
      const payload = await response.json() as { response?: string; error?: string };
      setTutorMessages((messages) => [
        ...messages,
        { role: "tutor", text: payload.response ?? payload.error ?? "The tutor is unavailable right now." },
      ]);
    } catch {
      setTutorMessages((messages) => [
        ...messages,
        { role: "tutor", text: "The tutor is offline. Try tracing the highlighted step and ask what invariant it preserves." },
      ]);
    }
  };

  const chooseQuizAnswer = (answer: number) => {
    if (quizAnswer !== null || quizComplete) return;
    setQuizAnswer(answer);
    if (answer === QUIZ_QUESTIONS[quizIndex].answer) {
      setQuizScore((score) => score + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (quizIndex >= QUIZ_QUESTIONS.length - 1) {
      const finalScore = quizScore + (quizAnswer === QUIZ_QUESTIONS[quizIndex].answer ? 1 : 0);
      setQuizAttempts((attempts) => attempts + 1);
      setQuizBestScore((best) => Math.max(best, finalScore));
      setQuizComplete(true);
      return;
    }
    setQuizIndex((index) => index + 1);
    setQuizAnswer(null);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizAnswer(null);
    setQuizScore(0);
    setQuizComplete(false);
  };

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");

    if (password.length < 8) {
      setAuthError("Use a password with at least 8 characters.");
      return;
    }

    if (authMode === "signup" && password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    setAuthPending(true);
    try {
      const response = await fetch(`/api/auth/${authMode === "signup" ? "signup" : "signin"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName,
          email: profileEmail,
          password,
        }),
      });
      const payload = await response.json() as { error?: string; requiresEmailConfirmation?: boolean };
      if (!response.ok) {
        setAuthError(payload.error ?? "Unable to authenticate.");
        return;
      }
      if (payload.requiresEmailConfirmation) {
        setAuthError("Account created. Check your email to confirm it, then sign in.");
        setAuthMode("signin");
        return;
      }
      setIsSignedIn(true);
    } catch {
      setAuthError("The authentication service is unavailable.");
    } finally {
      setAuthPending(false);
    }
  };

  const curriculumGroups = [
    {
      label: "Core",
      caption: "Core structures",
      items: [
        ["arrays", "Arrays"],
        ["strings", "Strings"],
        ["matrices", "Matrices"],
      ],
    },
    {
      label: "Linear Structures",
      caption: "Sequential access",
      items: [
        ["linked-lists", "Linked Lists"],
        ["stacks", "Stacks"],
        ["queues", "Queues"],
      ],
    },
    {
      label: "Non-Linear Structures",
      caption: "Relationships & hierarchy",
      items: [
        ["trees", "Trees"],
        ["graphs", "Graphs"],
      ],
    },
    {
      label: "Advanced",
      caption: "Algorithmic thinking",
      items: [
        ["big-o", "Big O Analysis"],
        ["recursion", "Recursion"],
        ["backtracking", "Backtracking"],
        ["divide-and-conquer", "Divide & Conquer"],
        ["sorting-searching", "Sorting & Searching"],
        ["greedy", "Greedy Algorithms"],
        ["dynamic-programming", "Dynamic Programming"],
        ["bit-manipulation", "Bit Manipulation"],
      ],
    },
  ] as const;

  /* =======================================================
     RENDER
  ======================================================= */

  if (isBooting) {
    return (
      <main className={`algocraft-splash theme-shell ${isDarkMode ? "theme-dark" : ""}`}>
        <div className="algocraft-splash-grid" />
        <div className="algocraft-splash-content">
          <AlgoRhythmLogo size="hero" />
          <div className="algocraft-wordmark">
            <span>Algo</span><strong>Rhythm</strong>
          </div>
          <p className="algocraft-tagline">Learn the logic. Craft the solution.</p>
          <div className="algocraft-loading"><span /><span /><span /></div>
        </div>
      </main>
    );
  }

  if (!hasStarted) {
    return (
      <main className={`theme-shell min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-950 ${isDarkMode ? "theme-dark" : ""}`}>
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlgoRhythmLogo size="large" />
              <div><p className="text-sm font-bold tracking-tight">AlgoRhythm</p><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Learn by seeing</p></div>
            </div>
            <div className="flex items-center gap-3"><ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode((value) => !value)} /><button onClick={() => setHasStarted(true)} className="text-xs font-semibold text-slate-600 transition hover:text-indigo-600">Sign in <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button></div>
          </div>

          <div className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
            <section>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600 shadow-sm"><Sparkles className="h-3.5 w-3.5" /> The visual way to learn DSA</div>
              <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl">Build the intuition behind every algorithm.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">A focused workspace for understanding data structures, tracing algorithms, and turning confusion into confident problem solving.</p>
              <div className="mt-8 flex flex-wrap items-center gap-3"><button onClick={() => setHasStarted(true)} className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-300 transition hover:bg-indigo-700">Start learning <ArrowRight className="h-4 w-4" /></button><span className="text-xs text-slate-400">Free interactive workspace · No setup</span></div>
              <div className="mt-12 grid max-w-xl grid-cols-3 gap-5 border-t border-slate-200 pt-5"><div><p className="text-xl font-semibold">24</p><p className="mt-1 text-xs text-slate-500">guided chapters</p></div><div><p className="text-xl font-semibold">80+</p><p className="mt-1 text-xs text-slate-500">visual steps</p></div><div><p className="text-xl font-semibold">1:1</p><p className="mt-1 text-xs text-slate-500">tutor mindset</p></div></div>
            </section>

            <section className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-6 rounded-[2rem] bg-indigo-100/60 blur-3xl" />
              <div className="algocraft-topic-float algocraft-topic-float-one"><span>🧠</span><div><strong>Algorithms</strong><small>Think in steps</small></div></div>
              <div className="algocraft-topic-float algocraft-topic-float-two"><span>🌳</span><div><strong>Trees</strong><small>See hierarchy</small></div></div>
              <div className="algocraft-topic-float algocraft-topic-float-three"><span>🕸️</span><div><strong>Graphs</strong><small>Map relationships</small></div></div>
              <div className="algocraft-topic-float algocraft-topic-float-four"><span>⚙️</span><div><strong>Complexity</strong><small>Measure growth</small></div></div>
              <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/50">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-300" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" /></div><span className="font-mono text-[10px] text-slate-400">workspace / arrays</span></div>
                <div className="grid gap-4 bg-slate-50 p-5 sm:grid-cols-[0.7fr_1.3fr]"><div className="space-y-2 rounded-xl bg-white p-3"><p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">Learning path</p>{["Arrays", "Linked Lists", "Trees", "Graphs"].map((item, index) => <div key={item} className={`rounded-lg px-3 py-2 text-xs font-semibold ${index === 0 ? "bg-indigo-50 text-indigo-700" : "text-slate-400"}`}>{item}</div>)}</div><div className="space-y-4"><div className="rounded-xl bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Live visualization</p><div className="mt-8 flex items-center justify-center gap-2">{[10, 20, 30, 40].map((value, index) => <div key={value} className="flex items-center gap-2"><div className={`flex h-12 w-12 items-center justify-center rounded-lg border text-sm font-bold ${index === 1 ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-100" : "border-slate-200 bg-slate-50 text-slate-600"}`}>{value}</div>{index < 3 && <span className="text-slate-300">→</span>}</div>)}</div><p className="mt-8 text-center text-xs text-slate-400">Compare. Predict. Execute.</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-950 p-4 text-white"><p className="text-[10px] uppercase tracking-widest text-indigo-300">Progress</p><p className="mt-3 text-2xl font-semibold">68%</p><div className="mt-3 h-1 rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-cyan-300" /></div></div><div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4"><BrainCircuit className="h-4 w-4 text-indigo-600" /><p className="mt-3 text-xs font-semibold text-indigo-900">Tutor ready</p><p className="mt-1 text-[10px] leading-4 text-indigo-700/70">Ask why, not just what.</p></div></div></div></div>
              </div>
            </section>
          </div>
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 border-t border-slate-200/80 pt-5 text-[11px] font-medium text-slate-500 sm:gap-3"><span className="mr-1 uppercase tracking-[0.16em] text-slate-400">Explore</span><span className="rounded-full border border-indigo-100 bg-white px-3 py-1.5">🔢 Arrays</span><span className="rounded-full border border-cyan-100 bg-white px-3 py-1.5">🔗 Linked Lists</span><span className="rounded-full border border-emerald-100 bg-white px-3 py-1.5">📚 Stacks & Queues</span><span className="rounded-full border border-amber-100 bg-white px-3 py-1.5">🌐 Graphs</span><span className="rounded-full border border-rose-100 bg-white px-3 py-1.5">🧩 Dynamic Programming</span></div>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className={`theme-shell flex min-h-screen items-center justify-center bg-[#f7f8fc] px-5 py-10 text-slate-950 ${isDarkMode ? "theme-dark" : ""}`}>
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden bg-slate-950 p-10 text-white lg:block"><div className="flex items-center gap-3"><AlgoRhythmLogo size="large" dark /><span className="text-sm font-semibold">AlgoRhythm</span></div><div className="mt-28"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">Your private workspace</p><h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.03em]">Pick up exactly where your curiosity left off.</h1><p className="mt-5 text-sm leading-6 text-slate-400">Save your chapters, quiz results, streaks, and tutor conversations in one calm learning space.</p></div><div className="mt-28 flex items-center gap-3 text-xs text-slate-400"><Check className="h-4 w-4 text-emerald-300" /> Progress sync is ready for you</div></div>
          <form onSubmit={submitAuth} className="p-7 sm:p-10">
            <div className="flex items-center justify-between"><button type="button" onClick={() => setHasStarted(false)} className="text-xs font-semibold text-slate-400 hover:text-slate-700">← Back to overview</button><ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode((value) => !value)} /></div>
            <div className="mt-12 max-w-sm"><div className="mb-8 grid grid-cols-2 rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => { setAuthMode("signin"); setAuthError(""); }} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${authMode === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Sign in</button><button type="button" onClick={() => { setAuthMode("signup"); setAuthError(""); }} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${authMode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Create account</button></div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">{authMode === "signup" ? "New to AlgoRhythm" : "Welcome back"}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">{authMode === "signup" ? "Create your account" : "Sign in to continue"}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{authMode === "signup" ? "Build a personal learning path and keep your progress in one place." : "Your learning path is waiting. Continue with your saved session."}</p>
              <div className="mt-8 space-y-4">
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Name</span><input required value={profileName} onChange={(event) => setProfileName(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Email address</span><input required type="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Password</span><div className="relative"><input required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div><span className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Use a unique password with 8 or more characters.</span></label>
                {authMode === "signup" && <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Confirm password</span><input required minLength={8} type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>}
                {authError && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{authError}</p>}
                <button disabled={authPending} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">{authPending ? "Connecting securely..." : authMode === "signup" ? "Create AlgoRhythm account" : "Enter AlgoRhythm"} {!authPending && <ArrowRight className="h-4 w-4" />}</button>
              </div><p className="mt-5 text-center text-[11px] leading-5 text-slate-400">Passwords are validated in the browser for this demo. Production auth must hash and verify them on a server.</p>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className={`theme-shell min-h-screen bg-slate-50 text-slate-900 ${isDarkMode ? "theme-dark" : ""}`}>

      {/* ===================================================
          TOP NAVBAR
      =================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">

          <div className="flex items-center gap-3">

            <AlgoRhythmLogo size="small" />

            <div>
              <h1 className="text-sm font-bold tracking-tight">
                AlgoRhythm
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                Interactive Algorithms
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {topic === "arrays"
                ? "Array Module"
                : topic === "strings"
                  ? "String Module"
                  : topic === "matrices"
                    ? "Matrix Module"
                    : topic === "linked-lists"
                      ? "Linked List Module"
                      : `${topic[0].toUpperCase()}${topic.slice(1)} Module`}
            </span>

            <button
              onClick={() => setQuizOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 sm:flex"
            >
              <Trophy className="h-3.5 w-3.5" />
              Practice quiz
            </button>

            <button
              onClick={async () => {
                if (!isSignedIn) {
                  setAuthOpen(true);
                  return;
                }
                await fetch("/api/auth/signout", { method: "POST" });
                setIsSignedIn(false);
                setHasStarted(false);
              }}
              className="flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              {isSignedIn ? <CircleUserRound className="h-3.5 w-3.5" /> : <LockKeyhole className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isSignedIn ? profileName : "Sign in"}</span>
            </button>

            <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode((value) => !value)} />

          </div>

        </div>

      </header>

      {/* ===================================================
          MAIN LAYOUT
      =================================================== */}

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-5 p-5 lg:grid-cols-[240px_minmax(0,1fr)_280px]">

        {/* =================================================
            LEFT SIDEBAR
        ================================================= */}

        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="space-y-5">
            {curriculumGroups.map((group) => (
              <div key={group.label}>
                <div className="mb-2 flex items-end justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {group.label}
                  </p>
                  <span className="text-[9px] text-slate-400">{group.caption}</span>
                </div>
                <div className="space-y-0.5">
                  {group.items.map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => {
                        setTopic(id);
                        setCurrentStep(0);
                        setIsPlaying(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                        topic === id
                          ? "bg-indigo-50 font-semibold text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{label}</span>
                      {topic === id && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden space-y-1">

            {[
              "Arrays",
              "Strings",
              "Matrices",
              "Linked Lists",
              "Stacks",
              "Queues",
              "Trees",
              "Graphs",
              "Big O Analysis",
              "Recursion",
              "Backtracking",
              "Divide and Conquer",
              "Sorting and Searching",
              "Greedy Algorithms",
              "Dynamic Programming",
              "Bit Manipulation",
            ].map((item) => (

              <button
                key={item}
                onClick={() => {
                  if (
                    item === "Arrays" ||
                    item === "Strings" ||
                    item === "Matrices" ||
                    item === "Linked Lists" ||
                    item === "Stacks" ||
                    item === "Queues" ||
                    item === "Trees" ||
                    item === "Graphs" ||
                    item === "Big O Analysis" ||
                    item === "Recursion" ||
                    item === "Backtracking" ||
                    item === "Divide and Conquer" ||
                    item === "Sorting and Searching" ||
                    item === "Greedy Algorithms" ||
                    item === "Dynamic Programming" ||
                    item === "Bit Manipulation"
                  ) {
                    setTopic(
                      item === "Arrays"
                        ? "arrays"
                        : item === "Strings"
                          ? "strings"
                          : item === "Matrices"
                            ? "matrices"
                            : item === "Linked Lists"
                              ? "linked-lists"
                              : item === "Big O Analysis"
                                ? "big-o"
                                : item === "Recursion"
                                  ? "recursion"
                                  : item === "Backtracking"
                                    ? "backtracking"
                                    : item === "Divide and Conquer"
                                      ? "divide-and-conquer"
                                      : item === "Sorting and Searching"
                                        ? "sorting-searching"
                                        : item === "Greedy Algorithms"
                                          ? "greedy"
                                          : item === "Dynamic Programming"
                                            ? "dynamic-programming"
                                            : item === "Bit Manipulation"
                                              ? "bit-manipulation"
                                              : item.toLowerCase() as StructureTopic
                    );
                    setCurrentStep(0);
                    setIsPlaying(false);
                  }
                }}
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  transition
                  ${
                    (item === "Arrays" &&
                      topic === "arrays") ||
                    (item === "Strings" &&
                      topic === "strings") ||
                    (item === "Matrices" &&
                      topic === "matrices") ||
                    (item === "Linked Lists" &&
                      topic === "linked-lists") ||
                    (item === "Stacks" && topic === "stacks") ||
                    (item === "Queues" && topic === "queues") ||
                    (item === "Trees" && topic === "trees") ||
                    (item === "Graphs" && topic === "graphs")
                    || (item === "Big O Analysis" && topic === "big-o")
                    || (item === "Recursion" && topic === "recursion")
                    || (item === "Backtracking" && topic === "backtracking")
                    || (item === "Divide and Conquer" && topic === "divide-and-conquer")
                    || (item === "Sorting and Searching" && topic === "sorting-searching")
                    || (item === "Greedy Algorithms" && topic === "greedy")
                    || (item === "Dynamic Programming" && topic === "dynamic-programming")
                    || (item === "Bit Manipulation" && topic === "bit-manipulation")
                      ? "bg-indigo-50 font-semibold text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                `}
              >

                <span>
                  {item}
                </span>

                {((item === "Arrays" &&
                  topic === "arrays") ||
                  (item === "Strings" &&
                    topic === "strings") ||
                  (item === "Matrices" &&
                    topic === "matrices") ||
                  (item === "Linked Lists" &&
                    topic === "linked-lists") ||
                  (item === "Stacks" && topic === "stacks") ||
                  (item === "Queues" && topic === "queues") ||
                  (item === "Trees" && topic === "trees") ||
                  (item === "Graphs" && topic === "graphs") ||
                  (item === "Big O Analysis" && topic === "big-o") ||
                  (item === "Recursion" && topic === "recursion") ||
                  (item === "Backtracking" && topic === "backtracking") ||
                  (item === "Divide and Conquer" && topic === "divide-and-conquer") ||
                  (item === "Sorting and Searching" && topic === "sorting-searching") ||
                  (item === "Greedy Algorithms" && topic === "greedy") ||
                  (item === "Dynamic Programming" && topic === "dynamic-programming") ||
                  (item === "Bit Manipulation" && topic === "bit-manipulation")) && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                )}
              </button>

            ))}

          </div>

          <div className="my-6 border-t border-slate-100" />

          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Coming Next
          </p>

          <div className="space-y-1">

            <div className="rounded-lg px-3 py-2 text-sm text-slate-400">
              More topics coming soon
            </div>

          </div>

        </aside>

        {/* =================================================
            CENTER WORKSPACE
        ================================================= */}

        <section className="min-w-0 space-y-5">

          {/* =================================================
              THEORY HEADER
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">

              <div>

                <div className="mb-2 flex items-center gap-2">

                  <span className="rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Data Structure
                  </span>

                  <span className="text-xs text-slate-400">
                    / {topic === "arrays"
                      ? "Arrays"
                      : topic === "strings"
                        ? "Strings"
                          : topic === "matrices"
                            ? "Matrices"
                              : topic === "linked-lists"
                                ? "Linked Lists"
                                : `${topic[0].toUpperCase()}${topic.slice(1)}`}
                  </span>

                </div>

                <h2 className="text-2xl font-bold tracking-tight">
                  {topic === "arrays"
                    ? "Arrays"
                    : topic === "strings"
                      ? "Strings"
                      : topic === "matrices"
                        ? "Matrices"
                          : topic === "linked-lists"
                            ? "Linked Lists"
                            : `${topic[0].toUpperCase()}${topic.slice(1)}`}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Explore {topic === "arrays"
                    ? "array"
                    : topic === "strings"
                      ? "string"
                      : topic === "matrices"
                        ? "matrix"
                        : topic === "linked-lists"
                          ? "linked list"
                          : topic} operations through
                  an interactive step-by-step execution
                  environment.
                </p>

              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Complexity
                </p>

                <p className="mt-1 font-mono text-sm font-semibold text-slate-700">
                  O(n)
                </p>

              </div>

            </div>

          </div>

          <article className="overflow-hidden rounded-2xl border border-stone-200 bg-[#fcfbf8] shadow-sm">
            <div className="border-b border-stone-200 px-5 py-4 sm:px-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                      AlgoRhythm / Field Guide
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500">Chapter 01 · Core concepts</p>
                  </div>
                </div>
                <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-stone-400 sm:block">
                  Read · 4 min
                </span>
              </div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-stone-200">
                <div className="h-full w-1/3 rounded-full bg-indigo-500" />
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_230px]">
              <div className="px-5 py-6 sm:px-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                  01 / The idea
                </p>
                <h3 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-stone-900">
                  {topic === "big-o" ? "Reading Complexity" : `${formatTopicTitle(topic)} Fundamentals`}
                </h3>
                <p className="mt-3 max-w-3xl font-serif text-base leading-7 text-stone-700 first-letter:text-4xl first-letter:font-semibold first-letter:text-indigo-600">
                  {TOPIC_GUIDES[topic].definition}
                </p>

                <div className="mt-7 space-y-6">
                  {TOPIC_GUIDES[topic].details.map((detail, index) => (
                    <div key={detail} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3">
                      <span className="pt-1 font-mono text-xs font-semibold text-indigo-500">0{index + 2}</span>
                      <p className="font-serif text-sm leading-7 text-stone-600">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="border-t border-stone-200 bg-stone-100/60 px-5 py-6 lg:border-l lg:border-t-0 sm:px-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">In this chapter</p>
                <div className="mt-4 space-y-2 border-b border-stone-200 pb-5">
                  {TOPIC_GUIDES[topic].parts.map((part, index) => (
                    <div key={part} className="flex items-center gap-2 text-xs text-stone-600">
                      <span className="font-mono text-[10px] text-stone-400">{String(index + 1).padStart(2, "0")}</span>
                      <span>{part}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">Complexity desk</p>
                  <p className="mt-2 font-mono text-xs leading-6 text-stone-600">{TOPIC_GUIDES[topic].complexity}</p>
                </div>
                <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Study cue</p>
                  <p className="mt-1 text-xs leading-5 text-indigo-900/70">Read the definition, predict the next step, then use the visualizer to test your model.</p>
                </div>
              </aside>
            </div>
          </article>

          {/* =================================================
              OPERATION SELECTOR
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex flex-wrap gap-2">

              {(topic === "arrays"
                ? arrayOperations
                : topic === "strings"
                  ? stringOperations
                  : topic === "matrices"
                    ? matrixOperations
                      : topic === "linked-lists"
                        ? linkedListOperations
                        : topic === "big-o"
                          ? bigOOperations
                          : topic === "recursion" ||
                              topic === "backtracking" ||
                              topic === "divide-and-conquer" ||
                              topic === "sorting-searching" ||
                              topic === "greedy" ||
                              topic === "dynamic-programming" ||
                              topic === "bit-manipulation"
                            ? advancedOperations
                            : structureOperations[topic]).map(
                (item) => (

                  <button
                    key={item.id}
                    onClick={() =>
                      topic === "arrays"
                        ? changeArrayOperation(item.id as ArrayOperation)
                        : topic === "strings"
                          ? changeStringOperation(item.id as StringOperation)
                          : topic === "matrices"
                            ? changeMatrixOperation(item.id as MatrixOperation)
                            : topic === "linked-lists"
                              ? changeLinkedListOperation(item.id as LinkedListOperation)
                              : topic === "big-o"
                                ? changeBigOOperation(item.id as BigOOperation)
                                : changeStructureOperation(item.id as StructureOperation)
                    }
                    className={`
                      rounded-lg
                      px-4
                      py-2
                      text-xs
                      font-semibold
                      transition
                      ${
                        operation === item.id
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }
                    `}
                  >
                    {item.label}
                  </button>

                )
              )}

            </div>

          </div>

          {/* =================================================
              INPUT PANEL
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4">

              <h3 className="text-sm font-semibold">
                Algorithm Input
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Modify the values and replay the
                algorithm.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {topic === "strings" && (
                <>
                  <label className="block md:col-span-2">
                    <span className="mb-1.5 block text-xs font-medium text-slate-600">
                      String
                    </span>
                    <input
                      value={stringInput}
                      onChange={(event) =>
                        setStringInput(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      placeholder="algorithm"
                    />
                  </label>

                  {(stringOperation === "search" ||
                    stringOperation === "anagram" ||
                    stringOperation === "replace") && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-slate-600">
                        Target
                      </span>
                      <input
                        value={stringTarget}
                        onChange={(event) =>
                          setStringTarget(event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      />
                    </label>
                  )}

                  {stringOperation === "replace" && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-slate-600">
                        Replacement
                      </span>
                      <input
                        value={replacement}
                        onChange={(event) =>
                          setReplacement(event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      />
                    </label>
                  )}
                </>
              )}

              {topic === "arrays" && (
                <>
              <label className="block md:col-span-2">

                <span className="mb-1.5 block text-xs font-medium text-slate-600">
                  Array
                </span>

                <input
                  value={arrayInput}
                  onChange={(event) =>
                    setArrayInput(
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2.5
                    font-mono
                    text-sm
                    outline-none
                    transition
                    focus:border-indigo-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-indigo-100
                  "
                  placeholder="10, 20, 30, 40, 50"
                />

              </label>

              {(operation === "search") && (

                <label className="block">

                  <span className="mb-1.5 block text-xs font-medium text-slate-600">
                    Target
                  </span>

                  <input
                    value={target}
                    onChange={(event) =>
                      setTarget(
                        event.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-slate-50
                      px-3
                      py-2.5
                      font-mono
                      text-sm
                      outline-none
                      focus:border-indigo-400
                      focus:bg-white
                      focus:ring-2
                      focus:ring-indigo-100
                    "
                  />

                </label>

              )}

              {(operation === "insert" ||
                operation === "delete" ||
                operation === "update") && (

                <label className="block">

                  <span className="mb-1.5 block text-xs font-medium text-slate-600">
                    Index
                  </span>

                  <input
                    value={index}
                    onChange={(event) =>
                      setIndex(
                        event.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-slate-50
                      px-3
                      py-2.5
                      font-mono
                      text-sm
                      outline-none
                      focus:border-indigo-400
                      focus:bg-white
                      focus:ring-2
                      focus:ring-indigo-100
                    "
                  />

                </label>

              )}

              {(operation === "insert" ||
                operation === "update") && (

                <label className="block">

                  <span className="mb-1.5 block text-xs font-medium text-slate-600">
                    Value
                  </span>

                  <input
                    value={value}
                    onChange={(event) =>
                      setValue(
                        event.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-slate-50
                      px-3
                      py-2.5
                      font-mono
                      text-sm
                      outline-none
                      focus:border-indigo-400
                      focus:bg-white
                      focus:ring-2
                      focus:ring-indigo-100
                    "
                  />

                </label>

              )}

                </>
              )}

              {topic === "matrices" && (
                <>
                  <label className="block md:col-span-2">
                    <span className="mb-1.5 block text-xs font-medium text-slate-600">
                      Matrix
                    </span>
                    <input
                      value={matrixInput}
                      onChange={(event) =>
                        setMatrixInput(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      placeholder="1, 2, 3; 4, 5, 6"
                    />
                    <span className="mt-1 block text-[11px] text-slate-400">
                      Separate rows with semicolons and values with commas.
                    </span>
                  </label>

                  {matrixOperation === "search" && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-slate-600">
                        Target
                      </span>
                      <input
                        value={matrixTarget}
                        onChange={(event) =>
                          setMatrixTarget(event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      />
                    </label>
                  )}
                </>
              )}

              {topic === "linked-lists" && (
                <>
                  <div className="md:col-span-2">
                    <span className="mb-1.5 block text-xs font-medium text-slate-600">
                      List Type
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {([
                        ["singly", "Singly Linked"],
                        ["doubly", "Doubly Linked"],
                        ["circular", "Circular Linked"],
                      ] as [LinkedListVariant, string][]).map(
                        ([variant, label]) => (
                          <button
                            key={variant}
                            type="button"
                            onClick={() => {
                              setLinkedListVariant(variant);
                              setCurrentStep(0);
                              setIsPlaying(false);
                            }}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                              linkedListVariant === variant
                                ? "bg-indigo-600 text-white"
                                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {label}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <label className="block md:col-span-2">
                    <span className="mb-1.5 block text-xs font-medium text-slate-600">
                      Node Values
                    </span>
                    <input
                      value={linkedListInput}
                      onChange={(event) => setLinkedListInput(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      placeholder="10, 20, 30, 40"
                    />
                  </label>

                  {linkedListOperation === "search" && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-slate-600">
                        Target
                      </span>
                      <input
                        value={linkedListTarget}
                        onChange={(event) => setLinkedListTarget(event.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      />
                    </label>
                  )}

                  {(linkedListOperation === "insert" ||
                    linkedListOperation === "delete") && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-slate-600">
                        Position
                      </span>
                      <input
                        value={index}
                        onChange={(event) => setIndex(event.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      />
                    </label>
                  )}

                  {linkedListOperation === "insert" && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-slate-600">
                        New Value
                      </span>
                      <input
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      />
                    </label>
                  )}
                </>
              )}

              {(topic === "stacks" || topic === "queues") && (
                <>
                  <label className="block md:col-span-2">
                    <span className="mb-1.5 block text-xs font-medium text-slate-600">
                      Current Values
                    </span>
                    <input
                      value={linkedListInput}
                      onChange={(event) => setLinkedListInput(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      placeholder="10, 20, 30, 40"
                    />
                  </label>
                  {(structureOperation === "push" || structureOperation === "enqueue") && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-slate-600">
                        New Value
                      </span>
                      <input
                        value={structureValue}
                        onChange={(event) => setStructureValue(event.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      />
                    </label>
                  )}
                </>
              )}

              {(topic === "trees" || topic === "graphs") && (
                <p className="text-xs leading-5 text-slate-500 md:col-span-2">
                  {topic === "trees"
                    ? "The example binary tree uses the root, parent, child, and leaf relationships shown during traversal."
                    : "The example graph uses six vertices and a shared edge set to compare breadth-first and depth-first search."}
                </p>
              )}

              {topic === "big-o" && (
                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-xs font-medium text-slate-600">
                    Input Size (n)
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={inputSize}
                    onChange={(event) => setInputSize(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                  <span className="mt-1 block text-[11px] text-slate-400">
                    Use a small n to keep quadratic examples easy to follow.
                  </span>
                </label>
              )}

            </div>

          </div>

          {/* =================================================
              VISUALIZATION
          ================================================= */}

          <VisualizationCanvas
            step={currentAlgorithmStep}
            totalSteps={
              algorithm.steps.length
            }
          />

          {/* =================================================
              EXECUTION CONTROLS
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-wrap items-center gap-3">

              <button
                onClick={() => {
                  setIsPlaying(false);
                  previousStep();
                }}
                disabled={
                  currentStep === 0
                }
                className="
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                ← Previous
              </button>

              <button
                onClick={() => {
                  if (
                    currentStep >=
                    algorithm.steps.length - 1
                  ) {
                    setCurrentStep(0);
                    setIsPlaying(true);
                    return;
                  }

                  setIsPlaying(
                    (previous) =>
                      !previous
                  );
                }}
                className="
                  rounded-lg
                  bg-indigo-600
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-indigo-700
                "
              >
                {isPlaying
                  ? "Pause"
                  : "Play"}
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  nextStep();
                }}
                disabled={
                  currentStep >=
                  algorithm.steps.length - 1
                }
                className="
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Next →
              </button>

              <button
                onClick={reset}
                className="
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-50
                "
              >
                Reset
              </button>

              <div className="ml-auto flex items-center gap-3">

                <span className="text-xs text-slate-400">
                  Speed
                </span>

                <input
                  type="range"
                  min="150"
                  max="1500"
                  step="50"
                  value={speed}
                  onChange={(event) =>
                    setSpeed(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="w-28 accent-indigo-600"
                />

              </div>

            </div>

            {/* PROGRESS */}

            <div className="mt-5">

              <div className="mb-2 flex justify-between text-xs">

                <span className="font-medium text-slate-500">
                  Execution Progress
                </span>

                <span className="font-mono text-slate-400">
                  {currentStep + 1}/
                  {algorithm.steps.length}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="
                    h-full
                    rounded-full
                    bg-indigo-600
                    transition-all
                    duration-300
                  "
                  style={{
                    width: `${
                      ((currentStep + 1) /
                        algorithm.steps.length) *
                      100
                    }%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* =================================================
              CODE PANEL
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-4">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-sm font-semibold">
                    Code Execution
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    JavaScript
                  </p>

                </div>

                <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] text-slate-500">
                  LINE{" "}
                  {currentAlgorithmStep.codeLine}
                </span>

              </div>

            </div>

            <pre className="overflow-x-auto bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-200">

              {algorithm.code
                .split("\n")
                .map(
                  (line, lineIndex) => {

                    const number =
                      lineIndex + 1;

                    const active =
                      number ===
                      currentAlgorithmStep.codeLine;

                    return (
                      <div
                        key={lineIndex}
                        className={`
                          flex
                          min-w-max
                          rounded
                          px-2
                          ${
                            active
                              ? "bg-indigo-500/20 text-white"
                              : ""
                          }
                        `}
                      >

                        <span className="mr-5 w-6 select-none text-right text-slate-600">
                          {number}
                        </span>

                        <span>
                          {line || " "}
                        </span>

                      </div>
                    );
                  }
                )}

            </pre>

          </div>

        </section>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <aside className="space-y-5">

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white shadow-lg shadow-slate-200/60">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                  Your learning path
                </p>
                <h3 className="mt-1 text-lg font-semibold">Keep the streak alive</h3>
              </div>
              <div className="rounded-xl bg-white/10 p-2 text-amber-300">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold">{progressPercent}%</p>
                <p className="mt-1 text-xs text-slate-400">{completedCount} of {totalTopics} lessons explored</p>
              </div>
              <p className="text-xs font-semibold text-emerald-300">+12% this week</p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
              <div><p className="text-sm font-semibold">7</p><p className="mt-1 text-[10px] text-slate-400">day streak</p></div>
              <div><p className="text-sm font-semibold">{completedCount}</p><p className="mt-1 text-[10px] text-slate-400">concepts</p></div>
              <div><p className="text-sm font-semibold">{quizAttempts ? Math.round((quizBestScore / QUIZ_QUESTIONS.length) * 100) : 0}%</p><p className="mt-1 text-[10px] text-slate-400">accuracy</p></div>
            </div>
          </div>

          {/* =================================================
              TELEMETRY
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-5">

              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Telemetry
              </p>

              <h3 className="mt-1 text-sm font-semibold">
                Execution Metrics
              </h3>

            </div>

            <div className="space-y-4">

              <Metric
                label="Current Step"
                value={`${currentStep + 1}`}
              />

              <Metric
                label="Total Steps"
                value={`${algorithm.steps.length}`}
              />

              <Metric
                label="Time Complexity"
                value="O(n)"
              />

              <Metric
                label="Space Complexity"
                value="O(1)"
              />

            </div>

          </div>

          {/* =================================================
              AI COMPANION
          ================================================= */}

          <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <BrainCircuit className="h-4 w-4" />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                  AI Companion
                </p>

                <h3 className="text-sm font-semibold">
                  Learn by reasoning
                </h3>

              </div>

            </div>

            <div className="mt-5 max-h-44 space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3">
              {tutorMessages.slice(-4).map((message, index) => (
                <div key={`${message.text}-${index}`} className={message.role === "learner" ? "ml-5 rounded-lg bg-indigo-600 px-3 py-2 text-xs leading-5 text-white" : "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600"}>
                  {message.text}
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                value={tutorInput}
                onChange={(event) => setTutorInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendTutorMessage();
                }}
                placeholder="Ask for a hint..."
                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <button onClick={sendTutorMessage} aria-label="Send question" className="rounded-lg bg-indigo-600 p-2.5 text-white transition hover:bg-indigo-700">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

            <button onClick={() => setQuizOpen(true)} className="mt-3 flex w-full items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100">
              <span className="flex items-center gap-2"><MessageCircle className="h-3.5 w-3.5" /> Turn this lesson into a quiz</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

          </div>

          {/* =================================================
              LEARNING TIP
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Learning Tip
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use Previous and Next to understand
              every individual operation before
              pressing Play.
            </p>

          </div>

        </aside>

      </div>

      {authOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-6">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><Sparkles className="h-5 w-5" /></div>
                <h2 className="text-xl font-semibold tracking-tight">Save your learning path</h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">Sign in to keep progress, streaks, and quiz results together.</p>
              </div>
              <button onClick={() => setAuthOpen(false)} aria-label="Close sign in" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4 p-6">
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Name</span><input value={profileName} onChange={(event) => setProfileName(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Email</span><input type="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Password</span><div className="relative"><input required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-10 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:bg-slate-100">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>
              <button disabled={password.length < 8} onClick={() => { setIsSignedIn(true); setAuthOpen(false); }} className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"><LockKeyhole className="h-4 w-4" /> Continue securely</button>
            </div>
          </div>
        </div>
      )}

      {quizOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div className="flex items-center gap-3"><div className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><Trophy className="h-5 w-5" /></div><div><p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Knowledge check</p><h2 className="text-lg font-semibold">DSA mastery quiz</h2></div></div>
              <button onClick={() => setQuizOpen(false)} aria-label="Close quiz" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
            </div>
            {quizComplete ? (
              <div className="p-8 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Trophy className="h-7 w-7" /></div><h3 className="mt-4 text-2xl font-semibold">{quizScore + (quizAnswer === QUIZ_QUESTIONS[quizIndex].answer ? 1 : 0)}/{QUIZ_QUESTIONS.length} correct</h3><p className="mt-2 text-sm text-slate-500">Your result has been added to this session&apos;s learning summary.</p><button onClick={resetQuiz} className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Try again</button></div>
            ) : (
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">{QUIZ_QUESTIONS[quizIndex].topic}</span></div>
                <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }} /></div>
                <h3 className="text-xl font-semibold leading-8 text-slate-900">{QUIZ_QUESTIONS[quizIndex].question}</h3>
                <div className="mt-6 grid gap-3">{QUIZ_QUESTIONS[quizIndex].options.map((option, index) => { const selected = quizAnswer === index; const correct = QUIZ_QUESTIONS[quizIndex].answer === index; return <button key={option} onClick={() => chooseQuizAnswer(index)} className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${selected ? correct ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-rose-300 bg-rose-50 text-rose-800" : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50"}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${selected ? correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white" : "bg-slate-100 text-slate-500"}`}>{String.fromCharCode(65 + index)}</span><span className="flex-1">{option}</span>{selected && <Check className="h-4 w-4" />}</button>; })}</div>
                {quizAnswer !== null && <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600"><span className="font-semibold text-slate-800">Tutor note: </span>{QUIZ_QUESTIONS[quizIndex].explanation}</div>}
                <div className="mt-6 flex justify-end"><button disabled={quizAnswer === null} onClick={nextQuizQuestion} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40">{quizIndex === QUIZ_QUESTIONS.length - 1 ? "Finish quiz" : "Next question"}<ChevronRight className="h-4 w-4" /></button></div>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}

/* =========================================================
   METRIC COMPONENT
========================================================= */

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">

      <span className="text-xs text-slate-400">
        {label}
      </span>

      <span className="font-mono text-xs font-semibold text-slate-700">
        {value}
      </span>

    </div>
  );
}

function ThemeToggle({
  isDarkMode,
  onToggle,
}: {
  isDarkMode: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 theme-dark:border-slate-700 theme-dark:bg-slate-900 theme-dark:text-slate-300"
    >
      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function AlgoRhythmLogo({
  size = "small",
  dark = false,
}: {
  size?: "small" | "large" | "hero";
  dark?: boolean;
}) {
  const large = size === "large";
  const hero = size === "hero";

  return (
    <div className={`algocraft-logo ${large ? "algocraft-logo-large" : ""} ${hero ? "algocraft-logo-hero" : ""} ${dark ? "algocraft-logo-dark" : ""}`} aria-label="AlgoRhythm logo">
      <div className="algocraft-logo-core">
        <span><b>A</b><i>R</i></span>
      </div>
    </div>
  );
}