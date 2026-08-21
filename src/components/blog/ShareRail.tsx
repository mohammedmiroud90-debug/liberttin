'use client';

import { useEffect, useState } from 'react';
import { Mail, Printer, Link2, Check } from 'lucide-react';

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.9 2H22l-7.1 8.1L23.2 22h-6.6l-5.1-6.7L5.6 22H2.5l7.6-8.7L1.2 2h6.8l4.6 6.1L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.4L17.8 20Z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.5 9.5H3.7V20h2.8V9.5ZM5.1 4A1.65 1.65 0 1 0 5.1 7.3 1.65 1.65 0 0 0 5.1 4ZM20.3 20h-2.8v-5.6c0-1.5-.5-2.5-1.8-2.5-1 0-1.5.7-1.8 1.3-.1.2-.1.6-.1.9V20h-2.8s.1-8.7 0-9.6h2.8v1.5c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.1V20Z" />
    </svg>
  );
}

type ShareTarget = {
  name: string;
  href: string;
  bg: string;
  icon: React.ReactNode;
  rowIcon: React.ReactNode;
};

function useShareTargets(title: string) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets: ShareTarget[] = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: 'bg-[#1877f2]',
      icon: <FacebookIcon className="h-4 w-4" />,
      rowIcon: <FacebookIcon className="h-[18px] w-[18px]" />,
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      bg: 'bg-black',
      icon: <XIcon className="h-3.5 w-3.5" />,
      rowIcon: <XIcon className="h-4 w-4" />,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bg: 'bg-[#0a66c2]',
      icon: <LinkedInIcon className="h-4 w-4" />,
      rowIcon: <LinkedInIcon className="h-[18px] w-[18px]" />,
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      bg: 'bg-[#e5006e]',
      icon: <Mail className="h-4 w-4" />,
      rowIcon: <Mail className="h-[18px] w-[18px]" strokeWidth={1.5} />,
    },
  ];

  return { targets, url };
}

/** Fixed vertical share strip pinned to the left edge on large screens. */
export function ShareRail({ title }: { title: string }) {
  const { targets } = useShareTargets(title);

  return (
    <aside
      className="hidden xl:flex fixed left-0 top-1/2 -translate-y-1/2 z-30 flex-col"
      aria-label="Share this article"
    >
      {targets.map((target) => (
        <a
          key={target.name}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${target.name}`}
          className={`${target.bg} flex h-9 w-9 items-center justify-center text-white opacity-90 hover:opacity-100 hover:w-11 transition-all duration-200`}
        >
          {target.icon}
          <span className="sr-only">Share on {target.name}</span>
        </a>
      ))}
    </aside>
  );
}

/** Inline share row shown under the article, next to "How we reviewed this article". */
export function ShareRow({ title }: { title: string }) {
  const { targets, url } = useShareTargets(title);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const iconClass =
    'flex h-8 w-8 items-center justify-center text-gray-600 hover:text-teal-700 transition-colors';

  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      <span className="text-[11px] uppercase tracking-wide text-gray-500">Share this article</span>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => window.print()} className={iconClass} title="Print">
          <Printer className="h-[18px] w-[18px]" strokeWidth={1.5} />
          <span className="sr-only">Print this article</span>
        </button>
        <button type="button" onClick={copyLink} className={iconClass} title="Copy link">
          {copied ? (
            <Check className="h-[18px] w-[18px] text-teal-700" strokeWidth={1.75} />
          ) : (
            <Link2 className="h-[18px] w-[18px]" strokeWidth={1.5} />
          )}
          <span className="sr-only">Copy link to this article</span>
        </button>
        {targets.map((target) => (
          <a
            key={target.name}
            href={target.href}
            target="_blank"
            rel="noopener noreferrer"
            className={iconClass}
            title={`Share on ${target.name}`}
          >
            {target.rowIcon}
            <span className="sr-only">Share on {target.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
