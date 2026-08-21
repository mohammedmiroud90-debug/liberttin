'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAuth } from './AuthProvider';
import { loginUser, signupUser } from '@/lib/blog/auth';
import { SITE_NAME, SIGN_IN_PANEL_SIDE, type SignInPanelSide } from '@/lib/site';

type Mode = 'signin' | 'signup';
type Step = 'providers' | 'email';

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.18 3.01-.8.86-2.1 1.52-3.2 1.43-.14-1.1.4-2.26 1.14-3.05.8-.88 2.2-1.52 3.24-1.39zM20.5 17.2c-.56 1.3-.83 1.88-1.55 3.03-1 1.55-2.41 3.48-4.16 3.5-1.55.02-1.95-1.01-4.06-1-2.1.01-2.55 1.02-4.1 1.04-1.74.02-3.07-1.77-4.07-3.31C.7 17.1-.7 12.4 1.3 9.2c1.1-1.74 2.84-2.84 4.5-2.84 1.68 0 2.73 1.04 4.12 1.04 1.35 0 2.17-1.05 4.12-1.05 1.47 0 3.03.8 4.12 2.18-3.62 1.98-3.03 7.14.34 8.67z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function SignInModal({ side = SIGN_IN_PANEL_SIDE }: { side?: SignInPanelSide }) {
  const { signInModalOpen, closeSignIn, login } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [step, setStep] = useState<Step>('providers');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isRight = side === 'right';

  useEffect(() => {
    if (!signInModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSignIn();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [signInModalOpen, closeSignIn]);

  useEffect(() => {
    if (!signInModalOpen) {
      setError('');
      setPassword('');
      setSubmitting(false);
      setStep('providers');
    }
  }, [signInModalOpen]);

  if (!signInModalOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user =
        mode === 'signin'
          ? await loginUser(email.trim(), password)
          : await signupUser(username.trim(), password, email.trim());
      login(user);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Something went wrong.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const providerButtonClass =
    'flex w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-5 py-3.5 text-[15px] font-medium text-gray-900 transition-colors hover:bg-gray-50';

  return (
    <div
      className={`fixed inset-0 z-[100] flex bg-black/45 ${isRight ? 'justify-end' : 'justify-start'}`}
      onClick={closeSignIn}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'signin' ? 'Sign in' : 'Create account'}
    >
      <div
        className={`relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl ${
          isRight ? 'slide-in-from-right' : 'slide-in-from-left'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeSignIn}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <div className="flex flex-1 flex-col items-center px-8 pb-10 pt-16 text-center sm:px-10">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-black">
            <Image
              src="/BRAND.png"
              alt={SITE_NAME}
              width={96}
              height={32}
              className="h-5 w-auto brightness-0 invert"
            />
          </div>

          <h2 className="mt-6 text-[1.65rem] font-bold leading-tight tracking-tight text-gray-900 sm:text-[1.85rem]">
            {mode === 'signin' ? `Sign in to ${SITE_NAME}` : 'Create your account'}
          </h2>

          <p className="mt-4 max-w-[20rem] text-[13px] leading-relaxed text-gray-600">
            By {mode === 'signin' ? 'signing in' : 'creating an account'}, you agree to our{' '}
            <Link href="/terms" className="text-[#2a8a8e] hover:underline">
              terms of use
            </Link>{' '}
            and acknowledge you have read our{' '}
            <Link href="/privacy" className="text-[#2a8a8e] hover:underline">
              privacy notice
            </Link>
            .
          </p>

          {step === 'providers' ? (
            <div className="mt-8 w-full max-w-sm space-y-3">
              <button
                type="button"
                className={providerButtonClass}
                onClick={() => {
                  setError('Apple sign-in is not available yet. Continue with email.');
                  setStep('email');
                }}
              >
                <AppleIcon className="h-5 w-5" />
                Continue with Apple
              </button>

              <button
                type="button"
                className={providerButtonClass}
                onClick={() => {
                  setError('Google sign-in is not available yet. Continue with email.');
                  setStep('email');
                }}
              >
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </button>

              <button
                type="button"
                className={providerButtonClass}
                onClick={() => {
                  setError('');
                  setStep('email');
                }}
              >
                Continue with email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 w-full max-w-sm space-y-3 text-left">
              <button
                type="button"
                onClick={() => {
                  setStep('providers');
                  setError('');
                }}
                className="mb-1 text-sm font-medium text-[#2a8a8e] hover:underline"
              >
                ← All sign-in options
              </button>

              {mode === 'signup' && (
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Username"
                  required
                  autoComplete="username"
                  className="w-full rounded-full border border-gray-300 bg-white px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#2a8a8e]"
                />
              )}

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                required
                autoComplete="email"
                className="w-full rounded-full border border-gray-300 bg-white px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#2a8a8e]"
              />

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full rounded-full border border-gray-300 bg-white px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#2a8a8e]"
              />

              {error && (
                <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-900">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === 'signin' ? 'Continue with email' : 'Create account'}
              </button>
            </form>
          )}

          {step === 'providers' && error && (
            <p className="mt-4 max-w-sm text-sm text-amber-800">{error}</p>
          )}

          <p className="mt-8 text-sm text-gray-600">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
                setStep(mode === 'signin' ? 'email' : 'providers');
              }}
              className="font-semibold text-[#2a8a8e] hover:underline"
            >
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
