/**
 * @file decode-html.ts
 * @description HTML entity decoding utility functions
 *
 * Provides functions to decode HTML entities from the Open Trivia Database API.
 * The API returns questions with HTML-encoded characters that need to be decoded.
 *
 * Features:
 * - decodeHtml: Decodes HTML entities (supports both server and client-side)
 *   - Server-side: Uses regex-based decoder
 *   - Client-side: Uses DOM textarea element
 * - decodeQuizQuestion: Decodes and formats a quiz question object
 *   - Decodes question text, correct answer, and incorrect answers
 *   - Creates shuffled allAnswers array
 *
 * Key exports:
 * - decodeHtml: Function to decode HTML entities
 * - decodeQuizQuestion: Function to decode and format quiz questions
 */

// Decode HTML entities to plain text
export const decodeHtml = (html: string): string => {
  // Server-side: use regex-based decoder when window is undefined
  if (typeof window === 'undefined') {
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&pi;/g, '\u03C0')
      .replace(/&eacute;/g, '\u00E9')
      .replace(/&ntilde;/g, '\u00F1')
      .replace(/&ouml;/g, '\u00F6')
      .replace(/&uuml;/g, '\u00FC')
      .replace(/&szlig;/g, '\u00DF')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
      .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
        String.fromCharCode(parseInt(code, 16))
      );
  }

  // Client-side: use DOM parser for decoding
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

// Decode and format a quiz question with shuffled answers
export const decodeQuizQuestion = <
  T extends { question: string; correct_answer: string; incorrect_answers: string[] }
>(
  question: T
): T & { allAnswers: string[] } => {
  // Decode question text and answer options
  const decodedQuestion = decodeHtml(question.question);
  const decodedCorrect = decodeHtml(question.correct_answer);
  const decodedIncorrect = question.incorrect_answers.map(decodeHtml);
  // Shuffle all answers randomly
  const allAnswers = [...decodedIncorrect, decodedCorrect].sort(
    () => Math.random() - 0.5
  );

  return {
    ...question,
    question: decodedQuestion,
    correctAnswer: decodedCorrect,
    incorrectAnswers: decodedIncorrect,
    allAnswers,
  };
};
