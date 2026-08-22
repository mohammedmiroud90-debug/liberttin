'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Download } from 'lucide-react';
import { AdminPanelHeader } from '@/components/admin/AdminRefreshButton';
import {
  getAllNewsletterSubscriptions,
  type NewsletterSubscription,
} from '@/lib/blog/newsletter';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await getAllNewsletterSubscriptions();
    setSubscribers(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const exportCsv = () => {
    const csv = ['email,subscribed_at']
      .concat(subscribers.map((row) => `${row.email},${row.createdAt}`))
      .join('\n');

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'subscribers.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="admin-main">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black pb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
            Audience
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">Subscribers</h1>
          <p className="mt-1 text-sm text-gray-600">
            Everyone who signed up from the blog.
          </p>
        </div>

        {subscribers.length > 0 && (
          <button type="button" onClick={exportCsv} className="admin-btn admin-btn-outline">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        )}
      </div>

      <div className="admin-panel mt-6 overflow-hidden">
        <AdminPanelHeader onRefresh={load} refreshing={loading}>
          {subscribers.length} subscriber{subscribers.length === 1 ? '' : 's'}
        </AdminPanelHeader>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-black" />
          </div>
        ) : subscribers.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-gray-500">No subscribers yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {subscribers.map((subscriber) => (
              <li
                key={subscriber.id}
                className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 text-sm transition-colors hover:bg-[#f7f7f7]"
              >
                <span className="font-medium text-black">{subscriber.email}</span>
                <span className="text-xs text-gray-500">
                  {subscriber.source ? `${subscriber.source} · ` : ''}
                  {new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
