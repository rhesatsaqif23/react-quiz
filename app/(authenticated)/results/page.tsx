'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { QuizResults } from '@/common/types/quiz';

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
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-lg text-white/60">Loading...</p>
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
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden px-4 pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-800" />
        <div className="absolute top-20 left-32 h-72 w-72 rotate-12 bg-gradient-to-br from-zinc-700/40 to-zinc-900/60 shadow-2xl blur-sm sm:h-96 sm:w-40" />
        <div className="absolute top-40 left-48 h-64 w-48 -rotate-12 bg-gradient-to-b from-zinc-600/30 to-zinc-800/50 shadow-xl sm:left-64 sm:h-80 sm:w-32" />
        <div className="absolute right-32 bottom-40 h-56 w-56 rotate-45 bg-gradient-to-br from-zinc-700/40 to-zinc-900/60 shadow-2xl sm:right-48 sm:h-72 sm:w-28" />
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent via-transparent to-black/50" />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          {/* Checkmark Icon */}
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.15)] sm:h-40 sm:w-40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:h-24 sm:w-24"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <p className="text-lg font-medium text-white/70 sm:text-xl">
            Your answer has been submitted
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Thankyou for taking Quiz
          </h1>
        </div>
      </div>

      {/* Results Section */}
      <div className="relative z-10 flex flex-1 flex-col items-center px-4 pb-16">
        <div className="w-full max-w-3xl space-y-8">
          {/* Score */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
            <div className="text-7xl font-bold text-primary sm:text-8xl">{results.score}%</div>
            <p className="mt-4 text-xl font-medium text-white/70">
              {getScoreMessage(results.score)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-white">{results.totalQuestions}</div>
              <p className="mt-1 text-sm text-white/60">Total Questions</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-white">{results.answeredQuestions}</div>
              <p className="mt-1 text-sm text-white/60">Answered</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary">{results.correctAnswers}</div>
              <p className="mt-1 text-sm text-white/60">Correct</p>
            </div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-red-400">{results.incorrectAnswers}</div>
              <p className="mt-1 text-sm text-white/60">Incorrect</p>
            </div>
          </div>

          {/* Time */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm">
            <p className="text-white/60">
              Time taken:{' '}
              <span className="font-semibold text-white">{formatTime(results.timeTaken)}</span>
            </p>
          </div>

          {/* Restart Button */}
          <button
            onClick={handleRestart}
            className="w-full rounded-xl bg-primary py-2 md:py-3 text-lg font-bold text-primary-foreground transition-all hover:shadow-[0_0_30px_rgba(179,255,0,0.3)]"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
