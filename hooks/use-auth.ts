'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

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
