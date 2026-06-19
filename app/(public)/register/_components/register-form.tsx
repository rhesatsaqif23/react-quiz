'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const registerSchema = z.object({
  name: z
    .string()
    .min(8, 'Name must be at least 8 characters')
    .max(30, 'Name must be at most 30 characters'),
  email: z
    .string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one symbol'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Registration failed');
        return;
      }

      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error('Registration successful but sign in failed. Please try logging in.');
      } else {
        toast.success('Registration successful!');
        router.push('/quiz');
        router.refresh();
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Register
        </h1>
        <p className="mt-3 text-xl md:text-2xl font-medium text-white/80">
          Create an account to start the quiz
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-medium text-white">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            {...register('name')}
            className="h-12 border-white/10 bg-white/5 text-base text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/30"
          />
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-medium text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            className="h-12 border-white/10 bg-white/5 text-base text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/30"
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-base font-medium text-white">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
              className="h-12 border-white/10 bg-white/5 pr-12 text-base text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-base font-medium text-white">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              className="h-12 border-white/10 bg-white/5 pr-12 text-base text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-primary py-2 md:py-3 text-lg font-bold text-primary-foreground transition-all hover:shadow-[0_0_30px_rgba(179,255,0,0.3)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
        >
          {isLoading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-center text-base text-white/60">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};
