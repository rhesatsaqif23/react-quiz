'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizConfig, QuizState } from '@/common/types/quiz';
import { DEFAULT_QUIZ_CONFIG } from '@/common/constants/trivia-categories';
import { decodeQuizQuestion } from '@/utils/decode-html';
import { QuestionCard } from './_components/question-card';
import { QuizTimer } from './_components/quiz-timer';
import { QuizProgress } from './_components/quiz-progress';

const TIME_PER_QUESTION = 60;
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
      timeRemaining: TIME_PER_QUESTION,
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
    timeRemaining: TIME_PER_QUESTION,
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
        timeRemaining: TIME_PER_QUESTION,
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
    setState((prev) => {
      const newAnswers = {
        ...prev.answers,
        [prev.currentIndex]: answer,
      };
      const nextIndex = prev.currentIndex + 1;
      const isLastQuestion = nextIndex >= prev.questions.length;

      if (isLastQuestion) {
        localStorage.removeItem(STORAGE_KEY_QUIZ_STATE);
        return {
          ...prev,
          answers: newAnswers,
          status: 'completed',
        };
      }

      return {
        ...prev,
        answers: newAnswers,
        currentIndex: nextIndex,
        timeRemaining: TIME_PER_QUESTION,
      };
    });
  }, []);

  const handleTimeUp = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'timeout',
    }));
    localStorage.removeItem(STORAGE_KEY_QUIZ_STATE);
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

      const totalTimeTaken =
        state.currentIndex * TIME_PER_QUESTION + (TIME_PER_QUESTION - state.timeRemaining);

      const results = {
        totalQuestions: state.questions.length,
        answeredQuestions: answered,
        correctAnswers: correct,
        incorrectAnswers: answered - correct,
        score: state.questions.length > 0 ? Math.round((correct / state.questions.length) * 100) : 0,
        timeTaken: totalTimeTaken,
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
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-3xl">
          <CardContent className="flex items-center justify-center p-8">
            <p>Loading questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-destructive">{error}</p>
            <div className="flex gap-4">
              <Button onClick={() => {
                fetchInitiated.current = false;
                setError(null);
                const config = getConfigFromStorage();
                fetchQuestions(config);
              }}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => router.push('/')}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.questions.length === 0 || !state.questions[state.currentIndex]) {
    return null;
  }

  const currentQuestion = state.questions[state.currentIndex];
  const answeredCount = Object.keys(state.answers).length;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl space-y-6">
        <QuizTimer
          timeRemaining={state.timeRemaining}
          totalTime={TIME_PER_QUESTION}
          onTimeUp={handleTimeUp}
        />
        <QuizProgress
          currentQuestion={state.currentIndex + 1}
          totalQuestions={state.questions.length}
          answeredQuestions={answeredCount}
        />
        <QuestionCard
          question={currentQuestion}
          questionNumber={state.currentIndex + 1}
          totalQuestions={state.questions.length}
          onAnswer={handleAnswer}
          selectedAnswer={state.answers[state.currentIndex]}
        />
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
