import type {
  CurriculumCategoryData,
  CurriculumTopic,
} from "../types/curriculum";

/* =========================================================
   FOUNDATIONAL
========================================================= */

const foundationalTopics: CurriculumTopic[] = [
  {
    id: "arrays",
    title: "Arrays",
    category: "Foundational",
    description:
      "A fundamental linear data structure that stores elements in contiguous memory locations.",
    difficulty: "Beginner",
    prerequisites: [],
    concepts: [
      "Array declaration",
      "Indexing",
      "Traversal",
      "Insertion",
      "Deletion",
      "Searching",
      "Updating",
      "Two-pointer technique",
      "Sliding window",
    ],
    useCases: [
      "Storing collections of data",
      "Image processing",
      "Lookup tables",
      "Buffers",
      "Database indexing",
    ],
    subtopics: [
      "Static Arrays",
      "Dynamic Arrays",
      "Array Traversal",
      "Insertion and Deletion",
      "Searching",
      "Two Pointers",
      "Sliding Window",
      "Prefix Sum",
    ],
  },

  {
    id: "strings",
    title: "Strings",
    category: "Foundational",
    description:
      "A sequence of characters used extensively in text processing and software applications.",
    difficulty: "Beginner",
    prerequisites: ["arrays"],
    concepts: [
      "String traversal",
      "Character frequency",
      "String comparison",
      "String reversal",
      "Pattern matching",
      "Palindrome checking",
      "String manipulation",
    ],
    useCases: [
      "Text editors",
      "Search engines",
      "Compilers",
      "Natural language processing",
      "Data validation",
    ],
    subtopics: [
      "String Representation",
      "Traversal",
      "Frequency Counting",
      "Palindrome",
      "Anagrams",
      "Pattern Matching",
      "String Hashing",
    ],
  },

  {
    id: "matrices",
    title: "Matrices",
    category: "Foundational",
    description:
      "Two-dimensional data structures commonly used for grids, mathematical operations, and image representation.",
    difficulty: "Beginner",
    prerequisites: ["arrays"],
    concepts: [
      "2D arrays",
      "Row traversal",
      "Column traversal",
      "Matrix traversal",
      "Matrix rotation",
      "Transpose",
      "Spiral traversal",
    ],
    useCases: [
      "Image processing",
      "Computer graphics",
      "Scientific computing",
      "Game boards",
      "Machine learning",
    ],
    subtopics: [
      "2D Arrays",
      "Matrix Traversal",
      "Transpose",
      "Rotation",
      "Spiral Matrix",
      "Matrix Search",
    ],
  },

  {
    id: "big-o",
    title: "Big O Analysis",
    category: "Foundational",
    description:
      "A mathematical framework for analyzing the time and space complexity of algorithms.",
    difficulty: "Beginner",
    prerequisites: [],
    concepts: [
      "Time complexity",
      "Space complexity",
      "Best case",
      "Average case",
      "Worst case",
      "Big O",
      "Big Omega",
      "Big Theta",
    ],
    useCases: [
      "Algorithm selection",
      "Performance optimization",
      "System design",
      "Scalability analysis",
    ],
    subtopics: [
      "Time Complexity",
      "Space Complexity",
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)",
      "O(n²)",
      "Complexity Comparison",
    ],
  },
];

/* =========================================================
   LINEAR STRUCTURES
========================================================= */

const linearTopics: CurriculumTopic[] = [
  {
    id: "linked-lists",
    title: "Linked Lists",
    category: "Linear Structures",
    description:
      "A dynamic linear data structure consisting of nodes connected through pointers.",
    difficulty: "Beginner",
    prerequisites: ["arrays"],
    concepts: [
      "Nodes",
      "Pointers",
      "Head pointer",
      "Traversal",
      "Insertion",
      "Deletion",
      "Searching",
      "Reversal",
    ],
    useCases: [
      "Memory management",
      "Music playlists",
      "Browser navigation",
      "Undo systems",
      "Dynamic data structures",
    ],
    subtopics: [
      "Singly Linked List",
      "Doubly Linked List",
      "Circular Linked List",
      "Insertion",
      "Deletion",
      "Searching",
      "Reversal",
    ],
  },

  {
    id: "stacks",
    title: "Stacks",
    category: "Linear Structures",
    description:
      "A LIFO data structure where the most recently inserted element is removed first.",
    difficulty: "Beginner",
    prerequisites: ["arrays", "linked-lists"],
    concepts: [
      "LIFO",
      "Push",
      "Pop",
      "Peek",
      "Overflow",
      "Underflow",
      "Stack implementation",
    ],
    useCases: [
      "Function calls",
      "Undo operations",
      "Expression evaluation",
      "Browser history",
      "Backtracking",
    ],
    subtopics: [
      "Stack using Array",
      "Stack using Linked List",
      "Push",
      "Pop",
      "Peek",
      "Infix to Postfix",
      "Parentheses Matching",
    ],
  },

  {
    id: "queues",
    title: "Queues",
    category: "Linear Structures",
    description:
      "A FIFO data structure where the first inserted element is removed first.",
    difficulty: "Beginner",
    prerequisites: ["arrays", "linked-lists"],
    concepts: [
      "FIFO",
      "Enqueue",
      "Dequeue",
      "Front",
      "Rear",
      "Circular Queue",
      "Deque",
      "Priority Queue",
    ],
    useCases: [
      "CPU scheduling",
      "Printer queues",
      "Network buffering",
      "Task scheduling",
      "Breadth-first search",
    ],
    subtopics: [
      "Simple Queue",
      "Circular Queue",
      "Deque",
      "Priority Queue",
      "Queue using Linked List",
    ],
  },
];

/* =========================================================
   HIERARCHICAL & NON-LINEAR
========================================================= */

const hierarchicalTopics: CurriculumTopic[] = [
  {
    id: "binary-trees",
    title: "Binary Trees",
    category: "Hierarchical & Non-Linear",
    description:
      "A hierarchical data structure where each node can have at most two children.",
    difficulty: "Intermediate",
    prerequisites: ["linked-lists", "stacks", "queues"],
    concepts: [
      "Tree terminology",
      "Root",
      "Leaf",
      "Parent",
      "Child",
      "Height",
      "Depth",
      "Tree traversal",
    ],
    useCases: [
      "File systems",
      "Expression trees",
      "Decision systems",
      "Hierarchical data",
    ],
    subtopics: [
      "Binary Tree Structure",
      "Preorder",
      "Inorder",
      "Postorder",
      "Level Order",
      "Height",
      "Tree Properties",
    ],
  },

  {
    id: "bst",
    title: "Binary Search Trees",
    category: "Hierarchical & Non-Linear",
    description:
      "A binary tree organized according to an ordering property that enables efficient searching.",
    difficulty: "Intermediate",
    prerequisites: ["binary-trees"],
    concepts: [
      "BST property",
      "Insertion",
      "Deletion",
      "Searching",
      "Minimum",
      "Maximum",
      "Successor",
      "Predecessor",
    ],
    useCases: [
      "Ordered data storage",
      "Searching",
      "Symbol tables",
      "Database indexing concepts",
    ],
    subtopics: [
      "BST Construction",
      "Search",
      "Insertion",
      "Deletion",
      "Minimum and Maximum",
      "Successor and Predecessor",
    ],
  },

  {
    id: "balanced-trees",
    title: "AVL & Red-Black Trees",
    category: "Hierarchical & Non-Linear",
    description:
      "Self-balancing binary search trees designed to maintain efficient operations.",
    difficulty: "Advanced",
    prerequisites: ["bst"],
    concepts: [
      "Tree balancing",
      "Rotations",
      "Balance factor",
      "AVL trees",
      "Red-Black trees",
      "Height balancing",
    ],
    useCases: [
      "Databases",
      "Operating systems",
      "Ordered maps",
      "Search-intensive systems",
    ],
    subtopics: [
      "AVL Trees",
      "Balance Factor",
      "LL Rotation",
      "RR Rotation",
      "LR Rotation",
      "RL Rotation",
      "Red-Black Trees",
    ],
  },

  {
    id: "heaps",
    title: "Heaps",
    category: "Hierarchical & Non-Linear",
    description:
      "A complete binary tree-based structure used to efficiently retrieve minimum or maximum elements.",
    difficulty: "Intermediate",
    prerequisites: ["binary-trees"],
    concepts: [
      "Min heap",
      "Max heap",
      "Heap property",
      "Heapify",
      "Insertion",
      "Deletion",
      "Priority queues",
    ],
    useCases: [
      "Priority queues",
      "Scheduling",
      "Heap sort",
      "Graph algorithms",
      "Event simulation",
    ],
    subtopics: [
      "Min Heap",
      "Max Heap",
      "Heapify",
      "Insertion",
      "Deletion",
      "Heap Sort",
      "Priority Queue",
    ],
  },

  {
    id: "graphs",
    title: "Graphs",
    category: "Hierarchical & Non-Linear",
    description:
      "A non-linear data structure consisting of vertices and edges used to model relationships.",
    difficulty: "Intermediate",
    prerequisites: ["queues", "stacks", "trees"],
    concepts: [
      "Vertices",
      "Edges",
      "Directed graphs",
      "Undirected graphs",
      "Weighted graphs",
      "Graph representation",
      "Traversal",
    ],
    useCases: [
      "Social networks",
      "Maps",
      "Computer networks",
      "Recommendation systems",
      "Dependency management",
    ],
    subtopics: [
      "Graph Terminology",
      "Adjacency Matrix",
      "Adjacency List",
      "BFS",
      "DFS",
      "Directed Graphs",
      "Undirected Graphs",
      "Weighted Graphs",
    ],
  },
];

/* =========================================================
   ADVANCED ALGORITHMS
========================================================= */

const advancedTopics: CurriculumTopic[] = [
  {
    id: "recursion",
    title: "Recursion",
    category: "Advanced Algorithms",
    description:
      "A problem-solving technique where a function solves a problem by calling itself on smaller instances.",
    difficulty: "Intermediate",
    prerequisites: ["stacks", "big-o"],
    concepts: [
      "Base case",
      "Recursive case",
      "Call stack",
      "Recursion tree",
      "Tail recursion",
    ],
    useCases: [
      "Tree traversal",
      "Divide and conquer",
      "Backtracking",
      "Parsing",
      "Mathematical computation",
    ],
    subtopics: [
      "Basic Recursion",
      "Factorial",
      "Fibonacci",
      "Call Stack",
      "Recursive Tree",
      "Tail Recursion",
    ],
  },

  {
    id: "backtracking",
    title: "Backtracking",
    category: "Advanced Algorithms",
    description:
      "A systematic technique that explores possible solutions and abandons paths that cannot lead to valid solutions.",
    difficulty: "Advanced",
    prerequisites: ["recursion"],
    concepts: [
      "State space",
      "Decision tree",
      "Constraint checking",
      "Backtracking",
      "Pruning",
    ],
    useCases: [
      "Puzzle solving",
      "Constraint satisfaction",
      "Combinatorial problems",
      "Scheduling",
    ],
    subtopics: [
      "Decision Trees",
      "N-Queens",
      "Sudoku",
      "Permutations",
      "Combinations",
      "Pruning",
    ],
  },

  {
    id: "divide-and-conquer",
    title: "Divide & Conquer",
    category: "Advanced Algorithms",
    description:
      "An algorithmic strategy that divides a problem into smaller subproblems, solves them, and combines their results.",
    difficulty: "Intermediate",
    prerequisites: ["recursion", "big-o"],
    concepts: [
      "Divide",
      "Conquer",
      "Combine",
      "Recurrence relations",
      "Recursive decomposition",
    ],
    useCases: [
      "Sorting",
      "Searching",
      "Large-scale computation",
      "Parallel algorithms",
    ],
    subtopics: [
      "Binary Search",
      "Merge Sort",
      "Quick Sort",
      "Recurrence Relations",
      "Master Theorem",
    ],
  },

  {
    id: "sorting-searching",
    title: "Sorting & Searching",
    category: "Advanced Algorithms",
    description:
      "Core algorithmic techniques for arranging data and efficiently locating elements.",
    difficulty: "Intermediate",
    prerequisites: ["arrays", "big-o"],
    concepts: [
      "Linear search",
      "Binary search",
      "Bubble sort",
      "Selection sort",
      "Insertion sort",
      "Merge sort",
      "Quick sort",
      "Heap sort",
    ],
    useCases: [
      "Databases",
      "Search systems",
      "Data processing",
      "Analytics",
      "Information retrieval",
    ],
    subtopics: [
      "Linear Search",
      "Binary Search",
      "Bubble Sort",
      "Selection Sort",
      "Insertion Sort",
      "Merge Sort",
      "Quick Sort",
      "Heap Sort",
    ],
  },

  {
    id: "greedy",
    title: "Greedy Algorithms",
    category: "Advanced Algorithms",
    description:
      "Algorithms that make locally optimal choices with the goal of constructing a globally optimal solution.",
    difficulty: "Advanced",
    prerequisites: ["sorting-searching", "big-o"],
    concepts: [
      "Greedy choice",
      "Optimal substructure",
      "Local optimum",
      "Global optimum",
      "Proof of correctness",
    ],
    useCases: [
      "Scheduling",
      "Network design",
      "Compression",
      "Optimization",
    ],
    subtopics: [
      "Activity Selection",
      "Fractional Knapsack",
      "Huffman Coding",
      "Job Sequencing",
      "Minimum Spanning Tree",
    ],
  },

  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    category: "Advanced Algorithms",
    description:
      "An optimization technique that solves overlapping subproblems while storing previously computed results.",
    difficulty: "Advanced",
    prerequisites: ["recursion", "big-o"],
    concepts: [
      "Overlapping subproblems",
      "Optimal substructure",
      "Memoization",
      "Tabulation",
      "State definition",
      "State transition",
    ],
    useCases: [
      "Optimization",
      "Scheduling",
      "Resource allocation",
      "Sequence analysis",
      "Path planning",
    ],
    subtopics: [
      "Memoization",
      "Tabulation",
      "0/1 Knapsack",
      "Longest Common Subsequence",
      "Longest Increasing Subsequence",
      "Coin Change",
      "Grid DP",
    ],
  },

  {
    id: "bit-manipulation",
    title: "Bit Manipulation",
    category: "Advanced Algorithms",
    description:
      "Techniques that operate directly on the binary representation of numbers.",
    difficulty: "Advanced",
    prerequisites: ["arrays", "big-o"],
    concepts: [
      "Binary representation",
      "AND",
      "OR",
      "XOR",
      "NOT",
      "Left shift",
      "Right shift",
      "Bit masking",
    ],
    useCases: [
      "Embedded systems",
      "Cryptography",
      "Low-level programming",
      "Performance optimization",
      "Hardware programming",
    ],
    subtopics: [
      "Bitwise AND",
      "Bitwise OR",
      "XOR",
      "Bitwise NOT",
      "Left Shift",
      "Right Shift",
      "Bit Masking",
      "Set/Clear/Toggle Bits",
    ],
  },
];

/* =========================================================
   COMPLETE CURRICULUM
========================================================= */

export const curriculum: CurriculumCategoryData[] = [
  {
    id: "foundational",
    title: "Foundational",
    description:
      "Build the fundamental concepts required to understand data structures and algorithms.",
    topics: foundationalTopics,
  },

  {
    id: "linear-structures",
    title: "Linear Structures",
    description:
      "Learn data structures where elements are organized sequentially.",
    topics: linearTopics,
  },

  {
    id: "hierarchical-non-linear",
    title: "Hierarchical & Non-Linear",
    description:
      "Explore trees, heaps, and graphs for representing hierarchical and relational data.",
    topics: hierarchicalTopics,
  },

  {
    id: "advanced-algorithms",
    title: "Advanced Algorithms",
    description:
      "Master algorithmic strategies used to solve complex computational problems.",
    topics: advancedTopics,
  },
];

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

export function getAllTopics(): CurriculumTopic[] {
  return curriculum.flatMap((category) => category.topics);
}

export function getTopicById(
  id: string
): CurriculumTopic | undefined {
  return getAllTopics().find((topic) => topic.id === id);
}

export function getCategoryById(
  id: string
): CurriculumCategoryData | undefined {
  return curriculum.find((category) => category.id === id);
}