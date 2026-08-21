/**
 * Renders stored post HTML with the site's typography applied.
 *
 * Posts are authored as raw HTML in the Parse backend without any styling, so
 * we inject utility classes per tag rather than shipping a global stylesheet
 * that would leak into the rest of the app.
 */

const TAG_CLASSES: Record<string, string> = {
  h1: 'text-[2rem] md:text-[2.4rem] font-bold mt-12 mb-4 leading-[1.15] tracking-tight scroll-mt-32 text-gray-900',
  h2: 'text-[1.6rem] md:text-[1.9rem] font-bold mt-10 mb-3 leading-[1.2] tracking-tight scroll-mt-32 text-gray-900',
  h3: 'text-[1.3rem] md:text-[1.5rem] font-bold mt-8 mb-3 leading-snug scroll-mt-32 text-gray-900',
  h4: 'text-[1.1rem] md:text-[1.25rem] font-bold mt-6 mb-2 scroll-mt-32 text-gray-900',
  p: 'text-[21px] text-gray-800 leading-[1.58] mb-7 break-words',
  ul: 'list-disc pl-7 space-y-3 mb-7 text-[21px] text-gray-800 leading-[1.58] marker:text-gray-600',
  ol: 'list-decimal pl-7 space-y-3 mb-7 text-[21px] text-gray-800 leading-[1.58] marker:text-gray-600',
  li: 'leading-[1.58] pl-1',
  blockquote:
    'border-l-[3px] border-gray-900 pl-6 py-2 my-8 italic text-gray-700 text-[21px] leading-[1.58]',
  a: 'text-gray-900 underline underline-offset-[3px] decoration-gray-900 hover:text-black transition-colors',
  img: 'w-full h-auto my-8',
  table: 'w-full text-sm text-left border-collapse my-8',
  th: 'border border-gray-300 bg-gray-100 px-4 py-3 font-bold text-gray-900',
  td: 'border border-gray-300 px-4 py-3 text-gray-800',
  pre: 'bg-gray-900 text-gray-100 text-[15px] rounded-md p-5 overflow-x-auto my-8 font-mono',
  code: 'font-mono text-[15px] bg-gray-100 text-gray-900 px-2 py-0.5 rounded',
  strong: 'font-bold text-gray-900',
  em: 'italic',
  hr: 'my-10 border-gray-200',
};

/**
 * When the wrapper controls typography, body-level tags must not carry their own
 * size or leading or they would beat the inherited values.
 */
const INHERITED_OVERRIDES: Record<string, string> = {
  p: 'text-gray-800 mb-7 break-words',
  ul: 'list-disc pl-7 space-y-3 mb-7 text-gray-800 marker:text-gray-600',
  ol: 'list-decimal pl-7 space-y-3 mb-7 text-gray-800 marker:text-gray-600',
  li: 'pl-1',
  blockquote: 'border-l-[3px] border-gray-900 pl-6 py-2 my-8 italic text-gray-700',
};

function styleHtml(html: string, inheritTypography: boolean): string {
  const tagClasses = inheritTypography
    ? { ...TAG_CLASSES, ...INHERITED_OVERRIDES }
    : TAG_CLASSES;

  let output = html;

  // Post bodies come from a trusted admin editor, but strip executable markup anyway.
  output = output
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  for (const [tag, classes] of Object.entries(tagClasses)) {
    // `pre > code` keeps the block styling from `pre`, so skip the inline pill there.
    const pattern = new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi');
    output = output.replace(pattern, (match, attrs = '') => {
      const existing = /class\s*=\s*["']([^"']*)["']/i.exec(attrs || '');
      if (existing) {
        return match.replace(existing[0], `class="${existing[1]} ${classes}"`);
      }
      return `<${tag}${attrs || ''} class="${classes}">`;
    });
  }

  output = output.replace(/<pre([^>]*)>\s*<code[^>]*>/gi, '<pre$1><code>');

  return output;
}

export function ArticleBody({
  html,
  inheritTypography = false,
}: {
  html: string;
  /** Let an ancestor set font family, size and leading (admin content settings). */
  inheritTypography?: boolean;
}) {
  return (
    <div
      className={`article-body blog-post-content max-w-none${
        inheritTypography ? ' typography-inherit' : ''
      }`}
      style={
        inheritTypography
          ? undefined
          : { fontFamily: "'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }
      }
      dangerouslySetInnerHTML={{ __html: styleHtml(html, inheritTypography) }}
    />
  );
}
