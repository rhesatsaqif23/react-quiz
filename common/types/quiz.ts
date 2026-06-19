/**
 * @file quiz.ts
 * @description TypeScript type definitions for quiz-related data
 *
 * Defines all the interfaces and types used throughout the quiz application:
 * - QuizConfig: Configuration settings for a quiz session
 * - Question: Individual quiz question with answers
 * - QuizState: Current state of an active quiz session
 * - QuestionResult: Result data for a single question after quiz completion
 * - QuizResults: Aggregated results data for a completed quiz
 *
 * These types are used across the application for type safety and consistency.
 */

// Quiz configuration settings for a session
export interface QuizConfig {
  amount: number;
  category: number;
  difficulty: string;
  type: string;
}

// Individual quiz question with answer options
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

// Current state of an active quiz session
export interface QuizState {
  questions: Question[];
  config: QuizConfig;
  currentIndex: number;
  answers: Record<number, string>;
  startedAt: number;
  status: 'idle' | 'active' | 'completed' | 'timeout';
}

// Result data for a single question after quiz completion
export interface QuestionResult {
  question: string;
  category: string;
  difficulty: string;
  correctAnswer: string;
  userAnswer: string | null;
  isCorrect: boolean;
}

// Aggregated results data for a completed quiz
export interface QuizResults {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  timeTaken: number;
  questionResults: QuestionResult[];
}
