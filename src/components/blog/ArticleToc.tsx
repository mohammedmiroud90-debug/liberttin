import type { ArticleHeading } from '@/lib/blog/headings';

/**
 * Inline jump links under the title. Dividers sit between items only, so a
 * wrapped row never ends on a dangling separator.
 */
export function ArticleToc({ headings }: { headings: ArticleHeading[] }) {
  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="mb-7">
      <ul className="flex flex-wrap items-center gap-y-1.5 text-[15px] leading-snug">
        {headings.map((heading, index) => (
          <li key={heading.id} className="flex items-center">
            {index > 0 && (
              <span
                className="mx-3 h-[15px] w-px shrink-0 bg-gray-300"
                aria-hidden="true"
              />
            )}
            <a
              href={`#${heading.id}`}
              className="font-semibold text-[#2a8a8e] no-underline transition-colors hover:text-[#1a5f62] hover:underline underline-offset-2"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
