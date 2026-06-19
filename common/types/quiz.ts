export interface QuizConfig {
  amount: number;
  category: number;
  difficulty: string;
  type: string;
}

export interface Question {
  id: number;
  category: string;
  type: 'boolean' | 'multiple';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  allAnswers: string[];
}

export interface QuizState {
  questions: Question[];
  config: QuizConfig;
  currentIndex: number;
  answers: Record<number, string>;
  startedAt: number;
  status: 'idle' | 'active' | 'completed' | 'timeout';
}

export interface QuizResults {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  timeTaken: number;
}
