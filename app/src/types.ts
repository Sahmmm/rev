export type Difficulty = "easy" | "medium" | "hard";
export type ReviewRating = "ok" | "review" | "difficult";

export type Topic = {
  id: string;
  name: string;
  description: string;
  parentTopicId: string | null;
  level: "foundation" | "intermediate" | "advanced";
  prerequisites: string[];
};

export type Source = {
  resourceId: string;
  resourceType: "course" | "exam" | "tp" | "personal-note";
  file: string;
  locator: string | null;
};

export type Resource = {
  id: string;
  title: string;
  type: "course" | "exam" | "tp" | "personal-note";
  path: string;
  topics: string[];
  status: "raw" | "processed" | "reviewed";
  notes?: string;
};

export type Flashcard = {
  id: string;
  type: "flashcard";
  question: string;
  answer: string;
  difficulty: Difficulty;
  topicIds: string[];
  tags: string[];
  source: Source;
  hints: string[];
  commonMistakes: string[];
  status: "draft" | "reviewed" | "active" | "archived";
};

export type WrittenQuestion = {
  id: string;
  type: "written-question";
  prompt: string;
  officialAnswer: string;
  expectedStructure: string[];
  gradingCriteria: string[];
  difficulty: Difficulty;
  topicIds: string[];
  tags: string[];
  source: Source;
  status: "draft" | "reviewed" | "active" | "archived";
};

export type Challenge = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  selection: {
    flashcardCount: number;
    writtenQuestionCount: number;
    topicStrategy: string;
    difficultyMix: {
      easy: number;
      medium: number;
      hard: number;
    };
  };
  successCriteria: string[];
  pedagogicalGoal: string;
  status: "draft" | "active" | "archived";
};

export type ProgressEntry = {
  rating: ReviewRating;
  reviewedAt: string;
  nextReviewAt: string;
  count: number;
};

export type SessionEntry = {
  id: string;
  type: "flashcards" | "written-question" | "challenge";
  title: string;
  rating: ReviewRating;
  createdAt: string;
};
