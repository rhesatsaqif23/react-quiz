'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { QuizConfig, QuizState } from '@/common/types/quiz';
import { DEFAULT_QUIZ_CONFIG } from '@/common/constants/trivia-categories';
import { decodeQuizQuestion } from '@/utils/decode-html';
import { Navbar } from '@/components/navbar';
import { QuestionCard } from './_components/question-card';
import { QuestionTimer, GlobalTimer } from './_components/quiz-timer';
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
  const [questionStartedAt, setQuestionStartedAt] = React.useState(() => Date.now());
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

      const now = Date.now();
      setState((prev) => ({
        ...prev,
        questions,
        config: quizConfig,
        currentIndex: 0,
        answers: {},
        startedAt: now,
        status: 'active',
      }));
      setQuestionStartedAt(now);
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

  const completeQuiz = React.useCallback((finalState: QuizState) => {
    let correct = 0;
    let answered = 0;
    const questionResults = finalState.questions.map((q, index) => {
      const userAnswer = finalState.answers[index] ?? null;
      const isCorrect = userAnswer === q.correctAnswer;
      if (userAnswer !== null) answered++;
      if (isCorrect) correct++;
      return {
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        correctAnswer: q.correctAnswer,
        userAnswer,
        isCorrect,
      };
    });

    const timeTaken = Math.floor((Date.now() - finalState.startedAt) / 1000);

    const results = {
      totalQuestions: finalState.questions.length,
      answeredQuestions: answered,
      correctAnswers: correct,
      incorrectAnswers: answered - correct,
      score: finalState.questions.length > 0 ? Math.round((correct / finalState.questions.length) * 100) : 0,
      timeTaken,
      questionResults,
    };
    localStorage.removeItem(STORAGE_KEY_QUIZ_STATE);
    localStorage.setItem(STORAGE_KEY_QUIZ_RESULTS, JSON.stringify(results));
    router.push('/results');
  }, [router]);

  const handleAnswer = React.useCallback((answer: string) => {
    setState((prev) => {
      const newAnswers = { ...prev.answers, [prev.currentIndex]: answer };
      const nextIndex = prev.currentIndex + 1;

      if (nextIndex >= prev.questions.length) {
        const completedState = { ...prev, answers: newAnswers, status: 'completed' as const };
        setTimeout(() => completeQuiz(completedState), 1000);
        return { ...prev, answers: newAnswers, status: 'completed' as const };
      }

      setTimeout(() => {
        setState((s) => ({ ...s, currentIndex: nextIndex }));
        setQuestionStartedAt(Date.now());
      }, 1000);

      return { ...prev, answers: newAnswers };
    });
  }, [completeQuiz]);

  const handleQuestionTimeout = React.useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'active') return prev;
      const nextIndex = prev.currentIndex + 1;

      if (nextIndex >= prev.questions.length) {
        const completedState = { ...prev, status: 'timeout' as const };
        setTimeout(() => completeQuiz(completedState), 300);
        return { ...prev, status: 'timeout' as const };
      }

      return { ...prev, currentIndex: nextIndex };
    });
    setQuestionStartedAt(Date.now());
  }, [completeQuiz]);

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <p className="mb-4 text-lg text-destructive">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              fetchInitiated.current = false;
              setError(null);
              const config = getConfigFromStorage();
              fetchQuestions(config);
            }}
            className="rounded-lg bg-muted px-6 py-3 text-sm font-medium text-foreground hover:bg-muted/80"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-muted"
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

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted" />
      <div className="animate-float1 absolute top-20 left-32 h-72 w-72 rotate-12 bg-gradient-to-br from-muted/40 to-muted/60 shadow-2xl blur-sm sm:h-96 sm:w-40" />
      <div className="animate-float2 absolute top-40 left-48 h-64 w-48 -rotate-12 bg-gradient-to-b from-muted/30 to-muted/50 shadow-xl sm:left-64 sm:h-80 sm:w-32" />
      <div className="animate-float3 absolute right-32 bottom-40 h-56 w-56 rotate-45 bg-gradient-to-br from-muted/40 to-muted/60 shadow-2xl sm:right-48 sm:h-72 sm:w-28" />
      <div className="animate-shine absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent via-transparent to-background/50" />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-8 px-20 pb-10 pt-24 sm:px-24">
        <QuizProgress
          currentQuestion={state.currentIndex + 1}
          totalQuestions={state.questions.length}
          answeredQuestions={answeredCount}
        />

        <QuestionTimer questionStartedAt={questionStartedAt} onTimeout={handleQuestionTimeout} />

        <QuestionCard
          question={currentQuestion}
          questionNumber={state.currentIndex + 1}
          totalQuestions={state.questions.length}
          onAnswer={handleAnswer}
          selectedAnswer={state.answers[state.currentIndex]}
        />

        <GlobalTimer quizStartedAt={state.startedAt} totalQuestions={state.questions.length} />
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
