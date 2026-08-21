'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Code2, Loader2, SquareCode } from 'lucide-react';

/**
 * Textarea with markdown-style code helpers. Comments stay plain text; the
 * fences are turned into <pre>/<code> at render time by CommentBody.
 */

export type CommentComposerHandle = { focus: () => void };

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitting?: boolean;
  rows?: number;
  placeholder?: string;
  submitLabel?: string;
  compact?: boolean;
};

export const CommentComposer = forwardRef<CommentComposerHandle, Props>(function CommentComposer(
  {
    value,
    onChange,
    onSubmit,
    onCancel,
    submitting = false,
    rows = 4,
    placeholder = 'What are your thoughts?',
    submitLabel = 'Respond',
    compact = false,
  },
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({ focus: () => textareaRef.current?.focus() }));

  const wrapSelection = (before: string, after: string, placeholderText: string) => {
    const node = textareaRef.current;
    if (!node) return;

    const start = node.selectionStart;
    const end = node.selectionEnd;
    const selected = value.slice(start, end) || placeholderText;
    const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;

    onChange(next);

    requestAnimationFrame(() => {
      node.focus();
      const caret = start + before.length;
      node.setSelectionRange(caret, caret + selected.length);
    });
  };

  return (
    <div>
      <div className="flex items-center gap-1 border border-b-0 border-gray-200 bg-white px-2 py-1.5">
        <button
          type="button"
          onClick={() => wrapSelection('`', '`', 'code')}
          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          title="Inline code"
        >
          <Code2 className="h-3.5 w-3.5" />
          Code
        </button>
        <button
          type="button"
          onClick={() => wrapSelection('\n```\n', '\n```\n', 'your snippet')}
          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          title="Code block"
        >
          <SquareCode className="h-3.5 w-3.5" />
          Snippet
        </button>
        <span className="ml-auto pr-1 text-[11px] text-gray-400">
          Wrap code in ``` for a block
        </span>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        spellCheck
        className={`w-full resize-y bg-[#f2f2f2] text-gray-900 placeholder-gray-500 outline-none ${
          compact ? 'px-3 py-2.5 text-sm' : 'px-4 py-3 text-[15px]'
        }`}
      />

      <div className="mt-2 flex justify-end gap-4 text-sm">
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 transition-colors hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={submitting || !value.trim()}
          onClick={onSubmit}
          className={`inline-flex items-center gap-2 bg-black font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#0066cc] disabled:opacity-50 ${
            compact ? 'px-4 py-1.5 text-xs' : 'px-5 py-2 text-xs'
          }`}
        >
          {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </div>
  );
});
