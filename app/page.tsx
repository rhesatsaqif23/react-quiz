'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { QuizConfigDialog } from './(public)/_components/quiz-config-dialog';

const STORAGE_KEY_QUIZ_STATE = 'quizState';

function hasActiveQuiz(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_QUIZ_STATE);
    if (!saved) return false;
    const parsed = JSON.parse(saved);
    return parsed.status === 'active' && parsed.questions?.length > 0;
  } catch {
    return false;
  }
}

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const [hasResume, setHasResume] = useState(false);

  React.useEffect(() => {
    setHasResume(hasActiveQuiz());
  }, []);

  const handleStartQuiz = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setDialogOpen(true);
  };

  const handleResumeQuiz = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push('/quiz');
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <Navbar />

      {/* Animated 3D Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted" />

        {/* 3D Shape 1 - Large tilted rectangle */}
        <div className="animate-float1 absolute top-10 left-10 h-[500px] w-[200px] rotate-12 bg-gradient-to-b from-muted/50 via-muted/30 to-muted/60 shadow-2xl blur-[1px] sm:left-20 sm:h-[600px] sm:w-[250px] md:left-32 md:h-[700px] md:w-[300px]" />

        {/* 3D Shape 2 - Angled block */}
        <div className="animate-float2 absolute top-40 left-48 h-[400px] w-[180px] -rotate-12 bg-gradient-to-b from-muted/40 via-muted/30 to-muted/50 shadow-xl sm:left-64 sm:h-[500px] sm:w-[200px] md:left-80 md:h-[600px] md:w-[240px]" />

        {/* 3D Shape 3 - Right side cube */}
        <div className="animate-float3 absolute right-10 bottom-20 h-[300px] w-[300px] rotate-45 bg-gradient-to-br from-muted/40 via-muted/30 to-muted/60 shadow-2xl sm:right-20 sm:h-[350px] sm:w-[350px] md:right-32 md:h-[400px] md:w-[400px]" />

        {/* Light beam effect */}
        <div className="animate-shine absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />

        {/* Glow effect */}
        <div className="animate-pulse-glow absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-20 text-center">
        <h1 className="text-6xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
          QUIZ TIME
        </h1>
        <p className="mt-4 text-2xl font-semibold text-muted-foreground sm:text-3xl md:text-4xl">
          Let&apos;s Put Your Knowledge to The Test!
        </p>
        <div className="mt-24 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <button
            onClick={handleStartQuiz}
            className="group rounded-full border-2 border-primary/40 bg-muted px-10 py-2 md:py-3 text-lg font-bold text-primary backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_30px_rgba(179,255,0,0.4)] sm:px-12 sm:py-5 sm:text-xl"
          >
            Start Quiz
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
              className="ml-2 inline-block transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>

          {hasResume && (
            <button
              onClick={handleResumeQuiz}
              className="group rounded-full border-2 border-foreground/20 bg-muted px-10 py-2 md:py-3 text-lg font-bold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-foreground/40 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black sm:px-12 sm:py-5 sm:text-xl"
            >
              Resume Quiz
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
                className="ml-2 inline-block transition-transform group-hover:translate-x-1"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <QuizConfigDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
