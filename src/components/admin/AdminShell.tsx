'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { useAuth } from '@/components/auth/AuthProvider';
import { userDisplayName } from '@/lib/blog/auth';

const NAV = [
  { href: '/admin', label: 'Posts' },
  { href: '/admin/comments', label: 'Comments' },
  { href: '/admin/subscribers', label: 'Subscribers' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin, openSignIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) openSignIn();
    else if (!isAdmin) router.replace('/');
  }, [isLoading, user, isAdmin, openSignIn, router]);

  if (isLoading) {
    return (
      <div
        className="admin-shell flex min-h-screen items-center justify-center bg-gray-50"
        style={{ fontFamily: 'var(--font-walby), system-ui, sans-serif' }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div
        className="admin-shell flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center"
        style={{ fontFamily: 'var(--font-walby), system-ui, sans-serif' }}
      >
        <h1 className="text-xl font-bold text-gray-900">Admin access required</h1>
        <p className="text-sm text-gray-600">
          Sign in with an administrator account to manage content.
        </p>
        <button
          type="button"
          onClick={openSignIn}
          className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div
      className="admin-shell min-h-screen bg-gray-50"
      style={{ fontFamily: 'var(--font-walby), system-ui, sans-serif' }}
    >
      <header className="sticky top-0 z-40 bg-black text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
          <BrandLogo href="/admin" variant="dark" priority />

          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-white/60 sm:inline">
              {userDisplayName(user)}
            </span>
            <Link
              href="/"
              className="rounded-full border border-white/30 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white hover:text-black"
            >
              View blog
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
