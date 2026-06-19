'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { QuizConfigDialog } from './(public)/_components/quiz-config-dialog';

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black dark:bg-black light:bg-gray-100">
      <Navbar />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-800 dark:from-zinc-900 dark:via-black dark:to-zinc-800 light:from-gray-200 light:via-gray-100 light:to-gray-300" />
      <div className="absolute top-20 left-32 h-72 w-72 rotate-12 bg-gradient-to-br from-zinc-700/40 to-zinc-900/60 shadow-2xl blur-sm sm:h-96 sm:w-40" />
      <div className="absolute top-40 left-48 h-64 w-48 -rotate-12 bg-gradient-to-b from-zinc-600/30 to-zinc-800/50 shadow-xl sm:left-64 sm:h-80 sm:w-32" />
      <div className="absolute right-32 bottom-40 h-56 w-56 rotate-45 bg-gradient-to-br from-zinc-700/40 to-zinc-900/60 shadow-2xl sm:right-48 sm:h-72 sm:w-28" />
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent via-transparent to-black/50 dark:to-black/50 light:to-white/30" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-20 text-center">
        <h1 className="text-6xl font-bold tracking-tight text-white dark:text-white light:text-black sm:text-7xl md:text-8xl lg:text-9xl">
          QUIZ TIME
        </h1>
        <p className="mt-4 text-2xl font-semibold text-white/80 dark:text-white/80 light:text-black/70 sm:text-3xl md:text-4xl">
          Let&apos;s Put Your Knowledge to The Test!
        </p>
        <div className="mt-16">
          <button
            onClick={() => setDialogOpen(true)}
            className="group rounded-full border border-primary/40 bg-grey/10 px-10 py-3 text-lg font-bold text-primary backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_30px_rgba(179,255,0,0.4)] sm:px-12 sm:py-5 sm:text-xl"
          >
            Start Test
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
        </div>
      </div>

      <QuizConfigDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
