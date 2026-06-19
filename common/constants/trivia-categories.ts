/**
 * @file trivia-categories.ts
 * @description Constants for trivia quiz configuration
 *
 * Defines all the constant values used for quiz configuration:
 * - TRIVIA_CATEGORIES: List of 24 trivia categories from Open Trivia Database
 * - QUIZ_DIFFICULTIES: Available difficulty levels (Any, Easy, Medium, Hard)
 * - QUIZ_TYPES: Question types (Any, Multiple Choice, True/False)
 * - QUIZ_AMOUNTS: Available question counts (5, 10, 15, 20, 25, 30)
 * - DEFAULT_QUIZ_CONFIG: Default configuration values
 *
 * These constants are used by the QuizConfigForm component and quiz state management.
 */

// Available trivia categories from Open Trivia Database
export const TRIVIA_CATEGORIES = [
  { id: 0, name: 'Any Category' },
  { id: 9, name: 'General Knowledge' },
  { id: 10, name: 'Entertainment: Books' },
  { id: 11, name: 'Entertainment: Film' },
  { id: 12, name: 'Entertainment: Music' },
  { id: 13, name: 'Entertainment: Musicals & Theatres' },
  { id: 14, name: 'Entertainment: Television' },
  { id: 15, name: 'Entertainment: Video Games' },
  { id: 16, name: 'Entertainment: Board Games' },
  { id: 17, name: 'Science & Nature' },
  { id: 18, name: 'Science: Computers' },
  { id: 19, name: 'Science: Mathematics' },
  { id: 20, name: 'Mythology' },
  { id: 21, name: 'Sports' },
  { id: 22, name: 'Geography' },
  { id: 23, name: 'History' },
  { id: 24, name: 'Politics' },
  { id: 25, name: 'Art' },
  { id: 26, name: 'Celebrities' },
  { id: 27, name: 'Animals' },
  { id: 28, name: 'Vehicles' },
  { id: 29, name: 'Entertainment: Comics' },
  { id: 30, name: 'Science: Gadgets' },
  { id: 31, name: 'Entertainment: Japanese Anime & Manga' },
  { id: 32, name: 'Entertainment: Cartoon & Animations' },
] as const;

// Available difficulty levels for quiz questions
export const QUIZ_DIFFICULTIES = [
  { value: 'any', label: 'Any Difficulty' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
] as const;

// Available question types for quiz
export const QUIZ_TYPES = [
  { value: 'any', label: 'Any Type' },
  { value: 'multiple', label: 'Multiple Choice' },
  { value: 'boolean', label: 'True / False' },
] as const;

// Available question counts for quiz
export const QUIZ_AMOUNTS = [5, 10, 15, 20, 25, 30] as const;

// Default quiz configuration values
export const DEFAULT_QUIZ_CONFIG = {
  amount: 10,
  category: 0,
  difficulty: 'any',
  type: 'any',
} as const;
