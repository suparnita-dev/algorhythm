export type CurriculumCategory =
  | "Foundational"
  | "Linear Structures"
  | "Hierarchical & Non-Linear"
  | "Advanced Algorithms";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface CurriculumTopic {
  id: string;
  title: string;
  category: CurriculumCategory;
  description: string;
  difficulty: Difficulty;
  prerequisites: string[];
  concepts: string[];
  useCases: string[];
  subtopics: string[];
}

export interface CurriculumCategoryData {
  id: string;
  title: CurriculumCategory;
  description: string;
  topics: CurriculumTopic[];
}