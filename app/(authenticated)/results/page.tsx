'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { QuizResults, QuestionResult } from '@/common/types/quiz';

function getInitialResults(): QuizResults | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const saved = localStorage.getItem('quizResults');
  if (saved) {
    try {
      return JSON.parse(saved) as QuizResults;
    } catch {
      localStorage.removeItem('quizResults');
    }
  }

  return null;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'text-green-500',
  medium: 'text-yellow-500',
  hard: 'text-red-500',
};

function QuestionResultCard({ result, index }: { result: QuestionResult; index: number }) {
  return (
    <div className={`rounded-xl border p-5 backdrop-blur-sm ${
      result.isCorrect
        ? 'border-green-500/30 bg-green-500/10'
        : 'border-red-500/30 bg-red-500/10'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
            result.isCorrect
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {index + 1}
          </span>
          <span className="text-sm text-muted-foreground">{result.category}</span>
          <span className={`text-xs font-medium ${DIFFICULTY_COLORS[result.difficulty] ?? 'text-muted-foreground'}`}>
            {result.difficulty}
          </span>
        </div>
        <span className={`text-sm font-semibold ${result.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
          {result.isCorrect ? 'Correct' : result.userAnswer === null ? 'Skipped' : 'Incorrect'}
        </span>
      </div>

      <p className="text-base font-medium text-foreground mb-3">{result.question}</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Your answer:</span>
          <span className={`text-sm font-medium ${result.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {result.userAnswer ?? 'No answer'}
          </span>
        </div>
        {!result.isCorrect && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Correct answer:</span>
            <span className="text-sm font-medium text-green-500">{result.correctAnswer}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [results] = React.useState<QuizResults | null>(getInitialResults);

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  React.useEffect(() => {
    if (status === 'authenticated' && !results) {
      router.push('/');
    }
  }, [results, router, status]);

  const handleRestart = () => {
    localStorage.removeItem('quizResults');
    router.push('/');
  };

  if (status === 'loading' || !results) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const getScoreMessage = (score: number): string => {
    if (score >= 80) return 'Excellent! Great job!';
    if (score >= 60) return 'Good work! Keep it up!';
    if (score >= 40) return 'Not bad! Try again!';
    return 'Keep practicing!';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden px-4 pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted" />
        <div className="absolute top-20 left-32 h-72 w-72 rotate-12 bg-gradient-to-br from-muted/40 to-muted/60 shadow-2xl blur-sm sm:h-96 sm:w-40" />
        <div className="absolute top-40 left-48 h-64 w-48 -rotate-12 bg-gradient-to-b from-muted/30 to-muted/50 shadow-xl sm:left-64 sm:h-80 sm:w-32" />
        <div className="absolute right-32 bottom-40 h-56 w-56 rotate-45 bg-gradient-to-br from-muted/40 to-muted/60 shadow-2xl sm:right-48 sm:h-72 sm:w-28" />
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent via-transparent to-background/50" />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          {/* Checkmark Icon */}
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-border bg-card shadow-[0_0_40px_rgba(255,255,255,0.15)] sm:h-40 sm:w-40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground sm:h-24 sm:w-24"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <p className="text-lg font-medium text-muted-foreground sm:text-xl">
            Your answer has been submitted
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Thankyou for taking Quiz
          </h1>
        </div>
      </div>

      {/* Results Section */}
      <div className="relative z-10 flex flex-1 flex-col items-center px-4 pb-16">
        <div className="w-full max-w-3xl space-y-8">
          {/* Score */}
          <div className="rounded-2xl border border-border bg-card/50 p-8 text-center backdrop-blur-sm">
            <div className="text-7xl font-bold text-primary sm:text-8xl">{results.score}%</div>
            <p className="mt-4 text-xl font-medium text-muted-foreground">
              {getScoreMessage(results.score)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-card/50 p-5 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-foreground">{results.totalQuestions}</div>
              <p className="mt-1 text-sm text-muted-foreground">Total Questions</p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 p-5 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-foreground">{results.answeredQuestions}</div>
              <p className="mt-1 text-sm text-muted-foreground">Answered</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary">{results.correctAnswers}</div>
              <p className="mt-1 text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-destructive">{results.incorrectAnswers}</div>
              <p className="mt-1 text-sm text-muted-foreground">Incorrect</p>
            </div>
          </div>

          {/* Time */}
          <div className="rounded-xl border border-border bg-card/50 p-5 text-center backdrop-blur-sm">
            <p className="text-muted-foreground">
              Time taken:{' '}
              <span className="font-semibold text-foreground">{formatTime(results.timeTaken)}</span>
            </p>
          </div>

          {/* Per-Question Results */}
          {results.questionResults && results.questionResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Question Review</h2>
              <div className="space-y-4">
                {results.questionResults.map((result, index) => (
                  <QuestionResultCard key={index} result={result} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Restart Button */}
          <button
            onClick={handleRestart}
            className="w-full rounded-xl bg-primary py-3 text-lg font-bold text-primary-foreground transition-all hover:shadow-[0_0_30px_rgba(179,255,0,0.3)]"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
