'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { addNewsletterSubscription } from '@/lib/blog/newsletter';

type Variant = 'sidebar' | 'wide';

/**
 * Black / white newsletter panel used on post and listing surfaces.
 * Square corners, high contrast — matches the site chrome (black header/footer).
 */
export function NewsletterCard({
  variant = 'wide',
  source,
}: {
  variant?: Variant;
  /** Written into NewsletterSubscription.source for analytics. */
  source?: string;
}) {
  const t = useTranslations('Blog');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setStatus('saving');

    try {
      await addNewsletterSubscription(
        email,
        source ?? (variant === 'sidebar' ? 'post-sidebar' : 'newsletter-card')
      );
      setStatus('done');
      setEmail('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Subscription failed.');
      setStatus('idle');
    }
  };

  const isSidebar = variant === 'sidebar';

  const shell = [
    'relative w-full overflow-hidden rounded-2xl bg-black text-left text-white',
    isSidebar ? 'p-5' : 'p-6 md:p-8',
  ].join(' ');

  if (status === 'done') {
    return (
      <div className={shell}>
        <div className="flex items-start gap-3">
          <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-white" strokeWidth={2.5} />
          <div>
            <h3 className="text-xl font-bold leading-tight text-white">
              {t('newsletterDoneTitle')}
            </h3>
            <p className="mt-2 text-sm leading-snug text-white/75">{t('newsletterDoneBody')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={shell}>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">
        {t('newsletterEyebrow')}
      </p>

      <h3
        className={
          isSidebar
            ? 'text-xl font-bold leading-tight text-white'
            : 'text-2xl font-bold leading-tight text-white md:text-[1.75rem]'
        }
      >
        {t('newsletterTitle')}
      </h3>

      <p
        className={
          isSidebar
            ? 'mt-3 text-sm leading-snug text-white/75'
            : 'mt-3 max-w-xl text-[15px] leading-snug text-white/75'
        }
      >
        {t('newsletterBody')}
      </p>

      <form
        onSubmit={handleSubmit}
        className={
          isSidebar ? 'mt-5 space-y-2' : 'mt-5 flex max-w-xl flex-col gap-2 sm:flex-row'
        }
      >
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('newsletterEmail')}
          aria-label={t('newsletterEmail')}
          className="w-full rounded-xl border border-white/25 bg-white px-4 py-3 text-sm text-black placeholder-gray-500 outline-none transition-colors focus:border-white focus:ring-1 focus:ring-white"
        />
        <button
          type="submit"
          disabled={status === 'saving'}
          className={
            isSidebar
              ? 'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.06em] text-black transition-colors hover:bg-gray-100 disabled:opacity-60'
              : 'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.06em] text-black transition-colors hover:bg-gray-100 disabled:opacity-60'
          }
        >
          {status === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}
          {t('newsletterSubscribe')}
        </button>
      </form>

      {error && <p className="mt-2 text-sm font-medium text-red-300">{error}</p>}

      <p className="mt-3 text-xs leading-snug text-white/50">{t('newsletterPrivacy')}</p>
    </div>
  );
}
