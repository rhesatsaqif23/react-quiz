'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { QuizConfig, QuizState } from '@/common/types/quiz';
import { DEFAULT_QUIZ_CONFIG } from '@/common/constants/trivia-categories';
import { decodeQuizQuestion } from '@/utils/decode-html';
import { Navbar } from '@/components/navbar';
import { QuestionCard } from './_components/question-card';
import { QuizTimer } from './_components/quiz-timer';
import { QuizProgress } from './_components/quiz-progress';

const STORAGE_KEY_QUIZ_STATE = 'quizState';
const STORAGE_KEY_QUIZ_CONFIG = 'quizConfig';
const STORAGE_KEY_QUIZ_RESULTS = 'quizResults';

function getConfigFromStorage(): QuizConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_QUIZ_CONFIG;
  }
  const saved = localStorage.getItem(STORAGE_KEY_QUIZ_CONFIG);
  if (saved) {
    try {
      return JSON.parse(saved) as QuizConfig;
    } catch {
      localStorage.removeItem(STORAGE_KEY_QUIZ_CONFIG);
    }
  }
  return DEFAULT_QUIZ_CONFIG;
}

function getInitialState(): QuizState {
  if (typeof window === 'undefined') {
    return {
      questions: [],
      config: DEFAULT_QUIZ_CONFIG,
      currentIndex: 0,
      answers: {},
      startedAt: Date.now(),
      status: 'idle',
    };
  }

  const saved = localStorage.getItem(STORAGE_KEY_QUIZ_STATE);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as QuizState;
      if (parsed.status === 'active' && parsed.questions.length > 0) {
        return parsed;
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY_QUIZ_STATE);
    }
  }

  return {
    questions: [],
    config: getConfigFromStorage(),
    currentIndex: 0,
    answers: {},
    startedAt: Date.now(),
    status: 'idle',
  };
}

function QuizContent() {
  const router = useRouter();
  const { status } = useSession();

  const [state, setState] = React.useState<QuizState>(getInitialState);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fetchInitiated = React.useRef(false);

  const fetchQuestions = React.useCallback(async (quizConfig: QuizConfig) => {
    if (fetchInitiated.current) return;
    fetchInitiated.current = true;

    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('amount', quizConfig.amount.toString());
      if (quizConfig.category > 0) {
        params.set('category', quizConfig.category.toString());
      }
      if (quizConfig.difficulty !== 'any') {
        params.set('difficulty', quizConfig.difficulty);
      }
      if (quizConfig.type !== 'any') {
        params.set('type', quizConfig.type);
      }

      const response = await fetch(`https://opentdb.com/api.php?${params.toString()}`);
      const data = await response.json();

      if (data.response_code !== 0) {
        throw new Error('Failed to fetch questions. Please try again.');
      }

      const questions = data.results.map(
        (q: Record<string, unknown>, index: number) => ({
          ...decodeQuizQuestion(q as {
            question: string;
            correct_answer: string;
            incorrect_answers: string[];
          }),
          id: index,
          category: q.category as string,
          type: q.type as 'boolean' | 'multiple',
          difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
        })
      );

      setState((prev) => ({
        ...prev,
        questions,
        config: quizConfig,
        currentIndex: 0,
        answers: {},
        startedAt: Date.now(),
        status: 'active',
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load questions'
      );
      fetchInitiated.current = false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (state.status === 'idle' && state.questions.length === 0 && !fetchInitiated.current) {
      const config = getConfigFromStorage();
      fetchQuestions(config);
    }
  }, [state.status, state.questions.length, fetchQuestions]);

  React.useEffect(() => {
    if (state.status === 'active' && state.questions.length > 0) {
      localStorage.setItem(STORAGE_KEY_QUIZ_STATE, JSON.stringify(state));
    }
  }, [state]);

  const handleAnswer = React.useCallback((answer: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [prev.currentIndex]: answer },
    }));
  }, []);

  const handleNext = React.useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) {
        localStorage.removeItem(STORAGE_KEY_QUIZ_STATE);
        return { ...prev, status: 'completed' };
      }
      return { ...prev, currentIndex: nextIndex };
    });
  }, []);

  const handlePrev = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
    }));
  }, []);

  const handleSubmit = React.useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_QUIZ_STATE);
    setState((prev) => ({ ...prev, status: 'completed' }));
  }, []);

  React.useEffect(() => {
    if (state.status === 'completed' || state.status === 'timeout') {
      let correct = 0;
      let answered = 0;
      Object.entries(state.answers).forEach(([index, answer]) => {
        answered++;
        if (answer === state.questions[parseInt(index)].correctAnswer) {
          correct++;
        }
      });

      const timeTaken = Math.floor((Date.now() - state.startedAt) / 1000);

      const results = {
        totalQuestions: state.questions.length,
        answeredQuestions: answered,
        correctAnswers: correct,
        incorrectAnswers: answered - correct,
        score: state.questions.length > 0 ? Math.round((correct / state.questions.length) * 100) : 0,
        timeTaken,
      };
      localStorage.setItem(STORAGE_KEY_QUIZ_RESULTS, JSON.stringify(results));
      router.push('/results');
    }
  }, [state, router]);

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-lg text-white/60">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
        <p className="mb-4 text-lg text-red-400">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              fetchInitiated.current = false;
              setError(null);
              const config = getConfigFromStorage();
              fetchQuestions(config);
            }}
            className="rounded-lg bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/20"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white/70 hover:bg-white/10"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (state.questions.length === 0 || !state.questions[state.currentIndex]) {
    return null;
  }

  const currentQuestion = state.questions[state.currentIndex];
  const answeredCount = Object.keys(state.answers).length;
  const isFirst = state.currentIndex === 0;
  const isLast = state.currentIndex === state.questions.length - 1;
  const hasAnsweredCurrent = state.answers[state.currentIndex] !== undefined;
  const allAnswered = answeredCount === state.questions.length;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-800" />
      <div className="absolute top-20 left-32 h-72 w-72 rotate-12 bg-gradient-to-br from-zinc-700/40 to-zinc-900/60 shadow-2xl blur-sm sm:h-96 sm:w-40" />
      <div className="absolute top-40 left-48 h-64 w-48 -rotate-12 bg-gradient-to-b from-zinc-600/30 to-zinc-800/50 shadow-xl sm:left-64 sm:h-80 sm:w-32" />
      <div className="absolute right-32 bottom-40 h-56 w-56 rotate-45 bg-gradient-to-br from-zinc-700/40 to-zinc-900/60 shadow-2xl sm:right-48 sm:h-72 sm:w-28" />
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent via-transparent to-black/50" />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-10 pt-24 sm:px-8">
        <QuizProgress
          currentQuestion={state.currentIndex + 1}
          totalQuestions={state.questions.length}
          answeredQuestions={answeredCount}
        />

        <QuizTimer startedAt={state.startedAt} />

        <QuestionCard
          question={currentQuestion}
          questionNumber={state.currentIndex + 1}
          totalQuestions={state.questions.length}
          onAnswer={handleAnswer}
          selectedAnswer={state.answers[state.currentIndex]}
        />

        {/* Navigation */}
        <div className="flex w-full max-w-lg items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="flex-1 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-all hover:shadow-[0_0_20px_rgba(179,255,0,0.3)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:shadow-none"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <p className="text-lg text-white/60">Loading...</p>
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
