'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { RegisterForm } from './_components/register-form';

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-lg text-white/60">Loading...</p>
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      <Navbar />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-800" />
      <div className="absolute top-20 left-32 h-72 w-72 rotate-12 bg-gradient-to-br from-zinc-700/40 to-zinc-900/60 shadow-2xl blur-sm sm:h-96 sm:w-40" />
      <div className="absolute top-40 left-48 h-64 w-48 -rotate-12 bg-gradient-to-b from-zinc-600/30 to-zinc-800/50 shadow-xl sm:left-64 sm:h-80 sm:w-32" />
      <div className="absolute right-32 bottom-40 h-56 w-56 rotate-45 bg-gradient-to-br from-zinc-700/40 to-zinc-900/60 shadow-2xl sm:right-48 sm:h-72 sm:w-28" />
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent via-transparent to-black/50" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-20">
        <RegisterForm />
      </div>
    </div>
  );
}
