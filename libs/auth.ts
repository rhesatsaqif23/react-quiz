/**
 * @file auth.ts
 * @description NextAuth.js configuration and authentication setup
 *
 * Configures NextAuth.js with Credentials provider for email/password authentication.
 * Uses Prisma to query the database for user validation and bcrypt for password hashing.
 *
 * Features:
 * - Credentials provider with email/password authentication
 * - JWT session strategy
 * - Custom callbacks for JWT and session handling
 * - Custom sign-in page configuration (/login)
 * - Database integration via Prisma ORM
 *
 * Key exports:
 * - handlers: NextAuth route handlers
 * - signIn: Sign-in function
 * - signOut: Sign-out function
 * - auth: Authentication function for middleware
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/libs/prisma';

// Initialize NextAuth with providers and configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // Validate credentials and return user object or null
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new Error('Account not found. Please register first.');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password. Please try again.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // Add user ID to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Add user ID to session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
