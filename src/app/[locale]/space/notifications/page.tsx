'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { userDisplayName } from '@/lib/blog/auth';
import { getAllComments, type ModerationComment } from '@/lib/blog/comments';

function namesOf(user: { username?: string; email?: string } | null) {
  if (!user) return [];
  return [user.username, user.email, userDisplayName(user as any)]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());
}

export default function SpaceNotificationsPage() {
  const { user } = useAuth();
  const [comments, setComments] = useState<ModerationComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllComments(300).then((list) => {
      setComments(list);
      setLoading(false);
    });
  }, []);

  const notifications = useMemo(() => {
    const names = namesOf(user);
    const mine = new Set(
      comments.filter((row) => names.includes(row.author.trim().toLowerCase())).map((row) => row.id)
    );
    return comments.filter((row) => row.parentId && mine.has(row.parentId));
  }, [comments, user]);

  return (
    <main className="admin-main">
      <h1 className="text-3xl font-bold tracking-tight text-black">Notifications</h1>
      <p className="mt-1 text-sm text-gray-600">Replies to your comments.</p>

      <div className="admin-panel mt-8 overflow-hidden">
        <div className="admin-panel-header">
          {notifications.length} notification{notifications.length === 1 ? '' : 's'}
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-black" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-gray-500">No notifications yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((row) => (
              <li key={row.id} className="px-5 py-4">
                <p className="text-sm font-medium text-black">{row.author} replied</p>
                <p className="mt-1 text-sm text-gray-700">{row.content}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(row.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
