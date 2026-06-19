'use client';

import React, { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

  const saved = localStorage.getItem('quizState');
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as QuizState;
      if (parsed.status === 'active') {
        return parsed;
      }
    } catch {
      localStorage.removeItem('quizState');
    }
  }

  return {
    questions: [],
    config: DEFAULT_QUIZ_CONFIG,
    currentIndex: 0,
    answers: {},
    timeRemaining: TIME_PER_QUESTION,
    status: 'idle',
  };
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  // Derive config from searchParams using useMemo
  const config = useMemo<QuizConfig>(() => {
    const amount = parseInt(searchParams.get('amount') || '10');
    const category = parseInt(searchParams.get('category') || '0');
    const difficulty = searchParams.get('difficulty') || 'any';
    const type = searchParams.get('type') || 'any';
    return { amount, category, difficulty, type };
  }, [searchParams]);

  const [state, setState] = React.useState<QuizState>(getInitialState);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch questions
  const fetchQuestions = React.useCallback(async (quizConfig: QuizConfig) => {
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

      const response = await fetch(
        `https://opentdb.com/api.php?${params.toString()}`
      );
      const data = await response.json();

      if (data.response_code !== 0) {
        throw new Error('Failed to fetch questions. Please try again.');
      }

      const questions = data.results.map(
        (q: Record<string, unknown>, index: number) => ({
          ...decodeQuizQuestion(q as { question: string; correct_answer: string; incorrect_answers: string[] }),
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
        status: 'active',
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load questions'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start quiz when config changes and no questions loaded
  React.useEffect(() => {
    if (state.status === 'idle' && state.questions.length === 0 && config.amount > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchQuestions(config);
    }
  }, [state.status, state.questions.length, config, fetchQuestions]);

  // Save state to localStorage
  React.useEffect(() => {
    if (state.status === 'active') {
      localStorage.setItem('quizState', JSON.stringify(state));
    }
  }, [state]);

  // Handle answer selection
  const handleAnswer = React.useCallback((answer: string) => {
    setState((prev) => {
      const newAnswers = {
        ...prev.answers,
        [prev.currentIndex]: answer,
      };
      const nextIndex = prev.currentIndex + 1;
      const isLastQuestion = nextIndex >= prev.questions.length;

      if (isLastQuestion) {
        localStorage.removeItem('quizState');
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

  // Handle timer expiry
  const handleTimeUp = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'timeout',
    }));
    localStorage.removeItem('quizState');
  }, []);

  // Redirect to results when quiz is completed or timed out
  React.useEffect(() => {
    if (state.status === 'completed' || state.status === 'timeout') {
      // Calculate and save results
      let correct = 0;
      let answered = 0;
      Object.entries(state.answers).forEach(([index, answer]) => {
        answered++;
        if (answer === state.questions[parseInt(index)].correctAnswer) {
          correct++;
        }
      });
      const results = {
        totalQuestions: state.questions.length,
        answeredQuestions: answered,
        correctAnswers: correct,
        incorrectAnswers: answered - correct,
        score: Math.round((correct / state.questions.length) * 100),
        timeTaken: (state.questions.length - 1) * TIME_PER_QUESTION + (TIME_PER_QUESTION - state.timeRemaining),
      };
      localStorage.setItem('quizResults', JSON.stringify(results));
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
        <Card className="w-full max-w-2xl">
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
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => router.push('/')}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.questions.length === 0) {
    return null;
  }

  const currentQuestion = state.questions[state.currentIndex];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        <QuizTimer
          timeRemaining={state.timeRemaining}
          totalTime={TIME_PER_QUESTION}
          onTimeUp={handleTimeUp}
        />
        <QuizProgress
          currentQuestion={state.currentIndex + 1}
          totalQuestions={state.questions.length}
          answeredQuestions={Object.keys(state.answers).length}
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
