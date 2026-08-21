/**
 * Renders a post's promo slot. Authors paste either a bare image URL or an HTML
 * snippet, so both are supported; executable markup is stripped either way.
 */

const URL_PATTERN = /^https?:\/\/[^\s<>"']+$/i;

function sanitizeAdHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/?(?:html|head|body|style|link|meta)\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');
}

export function AdSlot({
  content,
  variant = 'wide',
  label = 'Advertisement',
}: {
  content?: string;
  variant?: 'wide' | 'sidebar';
  label?: string;
}) {
  const trimmed = content?.trim();
  if (!trimmed) return null;

  const isSidebar = variant === 'sidebar';

  return (
    <aside className="w-full" aria-label={label}>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
        {label}
      </p>

      {URL_PATTERN.test(trimmed) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={trimmed}
          alt={label}
          loading="lazy"
          decoding="async"
          className={`block w-full object-cover ${isSidebar ? 'h-auto' : 'max-h-[320px]'}`}
        />
      ) : (
        <div
          className="ad-slot-html w-full overflow-hidden [&_img]:block [&_img]:h-auto [&_img]:w-full"
          dangerouslySetInnerHTML={{ __html: sanitizeAdHtml(trimmed) }}
        />
      )}
    </aside>
  );
}
