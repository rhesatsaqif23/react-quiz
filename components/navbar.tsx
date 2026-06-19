'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle';

export const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl dark:bg-black/40 light:bg-white/60 light:border-black/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/quiztime-icon.png"
            alt="QuizTime Logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
            priority
          />
          <span className="text-xl font-bold tracking-wide text-white light:text-black">
            QUIZ TIME
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isLoading ? null : isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-base font-semibold text-white light:text-black sm:block">
                {session?.user?.name ?? session?.user?.email ?? 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 light:border-black/20 light:bg-black/10 light:text-black light:hover:bg-black/20"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 light:border-black/20 light:bg-black/10 light:text-black light:hover:bg-black/20"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-all hover:shadow-[0_0_20px_rgba(179,255,0,0.3)]"
              >
                Register
              </Link>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
