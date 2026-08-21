'use client';

import { useEffect, useState } from 'react';
import { Loader2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Link } from '@/i18n/routing';
import {
  getAllFeedbackStats,
  type ArticleFeedback,
  type FeedbackTotals,
  type PostFeedbackStat,
} from '@/lib/blog/feedback';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [overall, setOverall] = useState<FeedbackTotals>({ yes: 0, no: 0, total: 0 });
  const [byPost, setByPost] = useState<PostFeedbackStat[]>([]);
  const [recent, setRecent] = useState<ArticleFeedback[]>([]);

  useEffect(() => {
    getAllFeedbackStats().then((data) => {
      setOverall(data.overall);
      setByPost(data.byPost);
      setRecent(data.recent);
      setLoading(false);
    });
  }, []);

  const helpfulRate =
    overall.total > 0 ? Math.round((overall.yes / overall.total) * 100) : 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="border-b border-black pb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
          Insights
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Yes / No votes from the “Was this article helpful?” control on each post.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total votes" value={String(overall.total)} />
            <StatCard
              label="Helpful (Yes)"
              value={String(overall.yes)}
              tone="yes"
              icon={<ThumbsUp className="h-4 w-4" />}
            />
            <StatCard
              label="Not helpful (No)"
              value={String(overall.no)}
              tone="no"
              icon={<ThumbsDown className="h-4 w-4" />}
            />
            <StatCard label="Helpful rate" value={`${helpfulRate}%`} />
          </div>

          <section className="admin-panel mt-8 overflow-hidden">
            <div className="admin-panel-header">By article ({byPost.length})</div>

            {byPost.length === 0 ? (
              <p className="px-5 py-16 text-center text-sm text-gray-500">
                No votes yet. They appear here as readers use the sidebar control.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {byPost.map((row) => {
                  const rate =
                    row.total > 0 ? Math.round((row.yes / row.total) * 100) : 0;

                  return (
                    <li
                      key={row.postId}
                      className="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors hover:bg-[#f7f7f7]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-black">
                          {row.postTitle || row.postSlug || row.postId}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {row.lastVotedAt &&
                            `Last vote ${new Date(row.lastVotedAt).toLocaleString('en-US')}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <span className="inline-flex items-center gap-1 border border-gray-300 bg-white px-2.5 py-1 font-medium text-black">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          {row.yes}
                        </span>
                        <span className="inline-flex items-center gap-1 border border-red-200 bg-red-50 px-2.5 py-1 font-medium text-red-700">
                          <ThumbsDown className="h-3.5 w-3.5" />
                          {row.no}
                        </span>
                        <span className="w-12 text-right text-xs text-gray-500">{rate}%</span>
                      </div>

                      {row.postSlug && (
                        <Link
                          href={`/blog/${row.postSlug}`}
                          className="admin-btn admin-btn-ghost"
                        >
                          View
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {recent.length > 0 && (
            <section className="admin-panel mt-8 overflow-hidden">
              <div className="admin-panel-header">Recent votes</div>
              <ul className="divide-y divide-gray-200">
                {recent.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm transition-colors hover:bg-[#f7f7f7]"
                  >
                    <div className="min-w-0">
                      <span
                        className={`mr-2 inline-flex px-2 py-0.5 text-xs font-semibold ${
                          row.vote === 'yes'
                            ? 'border border-gray-300 bg-white text-black'
                            : 'border border-red-200 bg-red-50 text-red-700'
                        }`}
                      >
                        {row.vote === 'yes' ? 'Yes' : 'No'}
                      </span>
                      <span className="text-black">
                        {row.postTitle || row.postSlug || row.postId}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(row.createdAt).toLocaleString('en-US')}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone?: 'yes' | 'no';
  icon?: React.ReactNode;
}) {
  const toneClass =
    tone === 'yes'
      ? 'border-black bg-white'
      : tone === 'no'
        ? 'border-red-200 bg-red-50'
        : 'border-gray-300 bg-white';

  return (
    <div className={`border px-5 py-4 ${toneClass}`}>
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-gray-500">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-black">{value}</p>
    </div>
  );
}
