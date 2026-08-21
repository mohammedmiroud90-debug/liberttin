'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  getOrCreateVisitorId,
  getPostFeedbackTotals,
  getVisitorVote,
  submitArticleFeedback,
  type FeedbackTotals,
  type FeedbackVote,
} from '@/lib/blog/feedback';

type Props = {
  postId: string;
  postSlug?: string;
  postTitle?: string;
};

/**
 * Circular Yes / No control matching the Healthline-style screenshot.
 * Votes land in the ArticleFeedback Parse class and power the admin Analytics page.
 */
export function ArticleHelpful({ postId, postSlug, postTitle }: Props) {
  const t = useTranslations('Blog');
  const [totals, setTotals] = useState<FeedbackTotals>({ yes: 0, no: 0, total: 0 });
  const [selected, setSelected] = useState<FeedbackVote | null>(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const visitorId = getOrCreateVisitorId();
      const [counts, prior] = await Promise.all([
        getPostFeedbackTotals(postId),
        getVisitorVote(postId, visitorId),
      ]);
      if (cancelled) return;
      setTotals(counts);
      setSelected(prior);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const vote = async (next: FeedbackVote) => {
    if (busy) return;
    setBusy(true);
    setError('');

    try {
      const visitorId = getOrCreateVisitorId();
      const counts = await submitArticleFeedback({
        postId,
        postSlug,
        postTitle,
        vote: next,
        visitorId,
      });
      setSelected(next);
      setTotals(counts);
    } catch {
      setError(t('helpfulError'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <p className="text-[15px] font-bold text-gray-900">{t('helpfulQuestion')}</p>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => vote('yes')}
          aria-pressed={selected === 'yes'}
          className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
            selected === 'yes'
              ? 'border-[#2a8a8e] bg-[#2a8a8e] text-white'
              : 'border-[#2a8a8e] bg-white text-[#2a8a8e] hover:bg-[#e8f5f5]'
          }`}
        >
          {busy && selected !== 'no' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t('helpfulYes')
          )}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => vote('no')}
          aria-pressed={selected === 'no'}
          className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
            selected === 'no'
              ? 'border-[#d46a6a] bg-[#d46a6a] text-white'
              : 'border-[#d46a6a] bg-white text-[#d46a6a] hover:bg-[#fdf0f0]'
          }`}
        >
          {busy && selected === 'no' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t('helpfulNo')
          )}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {ready && selected && (
        <p className="mt-3 text-xs text-gray-500">
          {t('helpfulThanks')}
          {totals.total > 0
            ? ` · ${t('helpfulStats', { yes: totals.yes, total: totals.total })}`
            : ''}
          .
        </p>
      )}
    </div>
  );
}
