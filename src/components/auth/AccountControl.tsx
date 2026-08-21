'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAuth } from './AuthProvider';
import { profilePictureUrl, userDisplayName } from '@/lib/blog/auth';

export function AccountControl({ compact = false }: { compact?: boolean }) {
  const { user, isLoading, isAdmin, openSignIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [menuOpen]);

  if (isLoading) {
    return <div className="h-8 w-20 animate-pulse rounded-full bg-white/10" />;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={openSignIn}
        className={`inline-flex items-center border-0 bg-transparent p-0 font-bold text-white no-underline shadow-none outline-none transition-colors hover:bg-transparent hover:text-gray-300 focus:outline-none focus-visible:outline-none ${
          compact ? 'text-[13px]' : 'text-sm'
        }`}
      >
        Sign in
      </button>
    );
  }

  const avatar = profilePictureUrl(user);
  const name = userDisplayName(user);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-xs font-bold uppercase">
            {name.charAt(0)}
          </span>
        )}
        {!compact && <span className="max-w-[7rem] truncate">{name}</span>}
        <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-gray-900 shadow-xl">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin dashboard
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
