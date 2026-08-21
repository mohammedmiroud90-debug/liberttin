import { Info } from 'lucide-react';

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 1.9-1.6 4.9-4.5 6.9l-.1.3 6.5 5 .5.1c4.1-3.8 6.6-9.4 6.6-15.6Z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.8 1.3-4.3 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-.3.1-6.7 5.2-.1.3C8 41.4 15.4 46 24 46Z"
      />
      <path
        fill="#FBBC05"
        d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4v-.3l-6.8-5.3-.2.1A22.1 22.1 0 0 0 2 24c0 3.5.9 6.9 2.5 9.9l7-5.5Z"
      />
      <path
        fill="#EA4335"
        d="M24 10.5c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 4.3 29.9 2 24 2 15.4 2 8 6.6 4.5 14.1l7 5.5c1.8-5.3 6.7-9.1 12.5-9.1Z"
      />
    </svg>
  );
}

/**
 * "Add <brand> on Google" chip. Links to Google's preferred-sources settings,
 * which is where readers actually mark a publisher as a preferred source.
 */
export function AddOnGoogle({ brand = 'BILLIANT' }: { brand?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <a
        href="https://www.google.com/preferences/source"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-[#0066cc]/40 px-3 py-1 text-[13px] font-medium text-[#0066cc] transition-colors hover:bg-[#eaf3fb]"
      >
        <GoogleGlyph className="h-3.5 w-3.5" />
        Add {brand} on Google
      </a>
      <span
        title={`Mark ${brand} as a preferred source so our articles surface more often in your Google results.`}
        className="text-gray-400"
      >
        <Info className="h-4 w-4" strokeWidth={1.75} />
        <span className="sr-only">About preferred sources</span>
      </span>
    </div>
  );
}
