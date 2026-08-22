'use client';

import { userDisplayName } from '@/lib/blog/auth';
import { useAuth } from '@/components/auth/AuthProvider';

export default function SpaceProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <main className="admin-main">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">Space</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">Profile</h1>
      <p className="mt-1 text-sm text-gray-600">Your Libertta account details.</p>

      <section className="admin-panel mt-8 p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-black">{userDisplayName(user)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Username</dt>
            <dd className="mt-1 text-sm text-black">{user.username || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-black">{user.email || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Account</dt>
            <dd className="mt-1 text-sm text-black">Member</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
