'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { AdminPanelHeader } from '@/components/admin/AdminRefreshButton';
import { getAllComments, type ModerationComment } from '@/lib/blog/comments';
import {
  getAllNewsletterSubscriptions,
  type NewsletterSubscription,
} from '@/lib/blog/newsletter';

type NotificationItem = {
  id: string;
  kind: 'comment' | 'reply' | 'subscriber';
  title: string;
  body: string;
  at: string;
  href?: string;
};

function commentItem(comment: ModerationComment): NotificationItem {
  const isReply = Boolean(comment.parentId);
  return {
    id: `comment-${comment.id}`,
    kind: isReply ? 'reply' : 'comment',
    title: isReply ? `${comment.author} replied` : `${comment.author} commented`,
    body: comment.content,
    at: comment.createdAt,
    href: comment.postId ? `/admin/comments?post=${comment.postId}` : '/admin/comments',
  };
}

function subscriberItem(row: NewsletterSubscription): NotificationItem {
  return {
    id: `sub-${row.id}`,
    kind: 'subscriber',
    title: 'New subscriber',
    body: row.email,
    at: row.createdAt,
    href: '/admin/subscribers',
  };
}

const KIND_LABEL: Record<NotificationItem['kind'], string> = {
  comment: 'Comment',
  reply: 'Reply',
  subscriber: 'Subscriber',
};

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [comments, subscribers] = await Promise.all([
      getAllComments(200).catch(() => [] as ModerationComment[]),
      getAllNewsletterSubscriptions().catch(() => [] as NewsletterSubscription[]),
    ]);
    const next = [
      ...comments.map(commentItem),
      ...subscribers.map(subscriberItem),
    ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
    setItems(next.slice(0, 80));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="admin-main">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">Inbox</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">Notifications</h1>
      <p className="mt-1 text-sm text-gray-600">
        New comments, replies, and newsletter subscribers.
      </p>

      <div className="admin-panel mt-8 overflow-hidden">
        <AdminPanelHeader onRefresh={load} refreshing={loading}>
          {items.length} notification{items.length === 1 ? '' : 's'}
        </AdminPanelHeader>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-black" />
          </div>
        ) : items.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-gray-500">No notifications yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold uppercase tracking-wide text-gray-700">
                    {KIND_LABEL[item.kind]}
                  </span>
                  <span>·</span>
                  <span>{new Date(item.at).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-black">{item.title}</p>
                <p className="mt-1 line-clamp-3 text-sm text-gray-700">{item.body}</p>
                {item.href ? (
                  <Link href={item.href} className="mt-2 inline-block text-sm text-[#2563eb]">
                    Open
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
