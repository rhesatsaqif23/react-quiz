/**
 * @file auth-provider.tsx
 * @description Authentication provider wrapper component
 *
 * Wraps the application with NextAuth's SessionProvider to provide
 * authentication context throughout the component tree.
 *
 * Key exports:
 * - AuthProvider: Component that provides auth context to children
 */

'use client';

import { SessionProvider } from 'next-auth/react';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Wrap app with NextAuth SessionProvider for auth context
export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
