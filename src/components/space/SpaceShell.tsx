'use client';

import { useEffect, useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { useAuth } from '@/components/auth/AuthProvider';
import { userDisplayName } from '@/lib/blog/auth';
import { getAllComments } from '@/lib/blog/comments';

const NAV = [
  { href: '/space', label: 'Profile' },
  { href: '/space/replies', label: 'Replies' },
  { href: '/space/history', label: 'History' },
];

function authorMatches(author: string, names: string[]) {
  return names.includes(author.trim().toLowerCase());
}

export function SpaceShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, openSignIn, logout } = useAuth();
  const router = useRouter();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    if (!user) openSignIn();
  }, [isLoading, user, openSignIn]);

  useEffect(() => {
    if (!user) return;
    const names = [user.username, user.email, userDisplayName(user)]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());

    getAllComments(200).then((comments) => {
      const mine = new Set(
        comments.filter((row) => authorMatches(row.author, names)).map((row) => row.id)
      );
      setUnread(comments.filter((row) => row.parentId && mine.has(row.parentId)).length);
    });
  }, [user]);

  if (isLoading) {
    return (
      <div className="admin-shell flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-shell flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
        <h1 className="text-xl font-bold text-gray-900">Sign in to open your space</h1>
        <p className="text-sm text-gray-600">Regular accounts use Space. Admins still use the dashboard.</p>
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
    <div className="admin-shell min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 w-full bg-black text-white">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
          <BrandLogo href="/space" variant="dark" text="Libertta" fontSize={36} fontWeight={700} />

          <nav className="admin-header-nav hidden items-center gap-2 sm:flex" aria-label="Space">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="admin-nav-link text-sm">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Link href="/space/notifications" className="relative text-white" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unread > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 min-w-[1rem] rounded-full bg-[#2563eb] px-1 text-center text-[10px] font-bold leading-4 text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              ) : null}
            </Link>
            <span className="hidden text-sm text-white/60 sm:inline">{userDisplayName(user)}</span>
            <Link href="/" className="admin-view-blog text-sm">
              View blog
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <nav className="flex gap-4 overflow-x-auto bg-black px-4 py-2 sm:hidden" aria-label="Space mobile">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="admin-nav-link whitespace-nowrap text-sm">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="admin-main-wrap flex-1">{children}</div>
    </div>
  );
}
