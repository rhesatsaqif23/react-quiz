/**
 * @file use-auth.ts
 * @description Custom hook for authentication state management
 *
 * Provides a convenient hook for accessing authentication state and functions.
 * Wraps NextAuth's useSession hook and adds additional functionality.
 *
 * Features:
 * - Access current user session data
 * - Check authentication status (isAuthenticated, isLoading)
 * - Logout function that redirects to login page
 *
 * Key exports:
 * - useAuth: Custom hook returning auth state and functions
 */

'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

// Custom hook for authentication state and functions
export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check if user is authenticated or loading
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

  // Sign out and redirect to login page
  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
  }, [router]);

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    logout,
  };
};
