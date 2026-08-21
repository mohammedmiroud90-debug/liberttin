import { Fragment } from 'react';

/**
 * Comments are stored as plain text (all HTML is stripped on write), so code is
 * expressed with markdown-style fences and rendered into real elements here.
 * Nothing is ever passed to dangerouslySetInnerHTML.
 */

type Segment =
  | { kind: 'text'; value: string }
  | { kind: 'block'; value: string; language?: string };

export function parseCommentSegments(content: string): Segment[] {
  const segments: Segment[] = [];
  const fence = /```([a-zA-Z0-9+#-]*)\n?([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fence.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: 'text', value: content.slice(lastIndex, match.index) });
    }
    segments.push({
      kind: 'block',
      language: match[1] || undefined,
      value: match[2].replace(/\n$/, ''),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ kind: 'text', value: content.slice(lastIndex) });
  }

  return segments;
}

/** Splits a text run on `inline code` spans. */
function renderInline(value: string, keyPrefix: string) {
  return value.split(/(`[^`\n]+`)/g).map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={key}
          className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[13px] text-gray-900"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <Fragment key={key}>{part}</Fragment>;
  });
}

export function CommentBody({ content }: { content: string }) {
  const segments = parseCommentSegments(content);

  return (
    <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-gray-800">
      {segments.map((segment, index) =>
        segment.kind === 'block' ? (
          <pre
            key={index}
            className="overflow-x-auto rounded-md bg-gray-900 p-3.5 text-[13px] leading-relaxed text-gray-100"
          >
            {segment.language && (
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {segment.language}
              </span>
            )}
            <code className="font-mono">{segment.value}</code>
          </pre>
        ) : (
          <p key={index} className="whitespace-pre-wrap">
            {renderInline(segment.value, String(index))}
          </p>
        )
      )}
    </div>
  );
}

/** Plain-text preview for admin lists, with fences flattened. */
export function commentPlainText(content: string): string {
  return content.replace(/```[a-zA-Z0-9+#-]*\n?/g, '').replace(/`/g, '').trim();
}
