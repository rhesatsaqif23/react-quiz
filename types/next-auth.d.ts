/**
 * @file next-auth.d.ts
 * @description TypeScript declarations for NextAuth.js module augmentation
 *
 * Extends the NextAuth types to include custom user ID field:
 * - Session.user.id: User ID string
 * - JWT.id: User ID string
 *
 * This allows accessing user.id throughout the application with type safety.
 */

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
