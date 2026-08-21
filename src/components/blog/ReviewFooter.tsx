import { History, Info } from 'lucide-react';
import { ShareRow } from '@/components/blog/ShareRail';

const pillClass =
  'inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full bg-[#f2f2f2] px-3 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-200';

export function ReviewFooter({
  title,
  publishedLabel,
  updatedLabel,
  sources,
}: {
  title: string;
  publishedLabel: string;
  updatedLabel: string | null;
  sources: { href: string; label: string }[];
}) {
  return (
    <div className="mt-12 border-t border-gray-200 pt-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="mb-3 text-lg font-bold text-black">How we reviewed this article:</h2>

          <div className="flex flex-wrap items-center gap-2">
            {sources.length > 0 && (
              <details className="group">
                <summary className={pillClass}>
                  <Info className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Sources
                </summary>
                <ul className="mt-3 space-y-1.5 border-l-2 border-gray-200 pl-4">
                  {sources.map((source) => (
                    <li key={source.href}>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-xs text-[#0066cc] underline underline-offset-2 hover:text-teal-700"
                      >
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <details className="group">
              <summary className={pillClass}>
                <History className="h-3.5 w-3.5" strokeWidth={1.75} />
                History
              </summary>
              <ul className="mt-3 space-y-1.5 border-l-2 border-gray-200 pl-4 text-xs text-gray-600">
                {updatedLabel && <li>Current version updated on {updatedLabel}</li>}
                <li>Originally published on {publishedLabel}</li>
              </ul>
            </details>
          </div>
        </div>

        <ShareRow title={title} />
      </div>
    </div>
  );
}
