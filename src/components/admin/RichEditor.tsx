'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Indent,
  Outdent,
  Link2,
  Eraser,
  ImagePlus,
  Loader2,
  Quote,
  Code2,
  Heading2,
  Heading3,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { uploadImage } from '@/lib/blog/upload';

type RichEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
};

const BLOCK_FORMATS = [
  { label: 'Paragraph', value: 'p' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Heading 4', value: 'h4' },
  { label: 'Quote', value: 'blockquote' },
  { label: 'Code block', value: 'pre' },
];

const TOOL_BUTTON =
  'flex h-9 w-9 items-center justify-center text-gray-700 transition-colors hover:bg-gray-200';

const BUBBLE_BUTTON =
  'flex h-8 w-8 items-center justify-center text-gray-200 transition-colors hover:bg-white/15 hover:text-white';

type BubbleAnchor = { top: number; left: number };

export function RichEditor({
  value,
  onChange,
  placeholder = 'Tell your story…',
  minHeight = '420px',
}: RichEditorProps) {
  const { user } = useAuth();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [imageWidth, setImageWidth] = useState('100%');
  const [textBubble, setTextBubble] = useState<BubbleAnchor | null>(null);
  const [imageBubble, setImageBubble] = useState<BubbleAnchor | null>(null);
  const [activeMarks, setActiveMarks] = useState<Record<string, boolean>>({});

  // Only sync from props when the editor is not the source of the change,
  // otherwise the caret jumps to the start on every keystroke.
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && value !== editor.innerHTML) editor.innerHTML = value;
  }, [value]);

  const emitChange = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  /** Converts a viewport rect into a position inside the editor wrapper. */
  const anchorFor = useCallback((rect: DOMRect): BubbleAnchor | null => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return null;

    const bounds = wrapper.getBoundingClientRect();
    const centre = rect.left - bounds.left + rect.width / 2;

    return {
      top: rect.top - bounds.top - 10,
      left: Math.min(Math.max(centre, 140), Math.max(bounds.width - 140, 140)),
    };
  }, []);

  const readMarks = () => {
    const state = (command: string) => {
      try {
        return document.queryCommandState(command);
      } catch {
        return false;
      }
    };

    setActiveMarks({
      bold: state('bold'),
      italic: state('italic'),
      underline: state('underline'),
      strikeThrough: state('strikeThrough'),
      insertUnorderedList: state('insertUnorderedList'),
    });
  };

  /** Shows the bubble toolbar over the current selection, hides it otherwise. */
  const syncSelection = useCallback(() => {
    const editor = editorRef.current;
    const selection = window.getSelection();

    if (!editor || !selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setTextBubble(null);
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) {
      setTextBubble(null);
      return;
    }

    const rect = range.getBoundingClientRect();
    if (!rect.width && !rect.height) {
      setTextBubble(null);
      return;
    }

    setTextBubble(anchorFor(rect));
    readMarks();
  }, [anchorFor]);

  useEffect(() => {
    document.addEventListener('selectionchange', syncSelection);
    window.addEventListener('resize', syncSelection);
    return () => {
      document.removeEventListener('selectionchange', syncSelection);
      window.removeEventListener('resize', syncSelection);
    };
  }, [syncSelection]);

  const run = (command: string, argument?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    emitChange();
    readMarks();
  };

  const insertImage = (url: string) => {
    editorRef.current?.focus();
    document.execCommand(
      'insertHTML',
      false,
      `<img src="${url}" style="max-width:100%;height:auto;" alt="" /><p><br/></p>`
    );
    emitChange();
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      insertImage(await uploadImage(file, user?.sessionToken));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const applyImageWidth = (width: string) => {
    setImageWidth(width);
    if (!selectedImage) return;
    selectedImage.style.width = width;
    selectedImage.style.height = 'auto';
    emitChange();
  };

  const applyImageAlign = (align: 'left' | 'center' | 'right') => {
    if (!selectedImage) return;
    selectedImage.style.display = 'block';
    selectedImage.style.marginLeft = align === 'left' ? '0' : 'auto';
    selectedImage.style.marginRight = align === 'right' ? '0' : 'auto';
    emitChange();
  };

  const selectImage = (image: HTMLImageElement | null) => {
    setSelectedImage(image);
    if (image) {
      setImageWidth(image.style.width || '100%');
      setImageBubble(anchorFor(image.getBoundingClientRect()));
      setTextBubble(null);
    } else {
      setImageBubble(null);
    }
  };

  return (
    <div ref={wrapperRef} className="relative border border-gray-300 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <select
          onChange={(event) => {
            run('formatBlock', event.target.value);
            event.target.selectedIndex = 0;
          }}
          className="mr-1 border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none"
          defaultValue=""
        >
          <option value="" disabled>
            Format
          </option>
          {BLOCK_FORMATS.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>

        <span className="mx-1 h-6 w-px bg-gray-300" />

        <button type="button" onClick={() => run('bold')} className={TOOL_BUTTON} title="Bold">
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => run('italic')} className={TOOL_BUTTON} title="Italic">
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => run('underline')}
          className={TOOL_BUTTON}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => run('strikeThrough')}
          className={TOOL_BUTTON}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <span className="mx-1 h-6 w-px bg-gray-300" />

        <button
          type="button"
          onClick={() => run('insertUnorderedList')}
          className={TOOL_BUTTON}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => run('insertOrderedList')}
          className={TOOL_BUTTON}
          title="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <span className="mx-1 h-6 w-px bg-gray-300" />

        <button
          type="button"
          onClick={() => run('justifyLeft')}
          className={TOOL_BUTTON}
          title="Align left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => run('justifyCenter')}
          className={TOOL_BUTTON}
          title="Align center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => run('justifyRight')}
          className={TOOL_BUTTON}
          title="Align right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => run('outdent')}
          className={TOOL_BUTTON}
          title="Outdent"
        >
          <Outdent className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => run('indent')} className={TOOL_BUTTON} title="Indent">
          <Indent className="h-4 w-4" />
        </button>

        <span className="mx-1 h-6 w-px bg-gray-300" />

        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) run('createLink', url);
          }}
          className={TOOL_BUTTON}
          title="Insert link"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => run('removeFormat')}
          className={TOOL_BUTTON}
          title="Clear formatting"
        >
          <Eraser className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={TOOL_BUTTON}
          title="Insert image"
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={emitChange}
        onClick={(event) => {
          const target = event.target as HTMLElement;
          selectImage(target.tagName === 'IMG' ? (target as HTMLImageElement) : null);
        }}
        onKeyUp={syncSelection}
        onMouseUp={syncSelection}
        style={{ minHeight }}
        className="article-body prose prose-lg max-w-none px-6 py-4 outline-none empty:before:text-gray-300 empty:before:content-[attr(data-placeholder)]"
      />

      {/* Context toolbar: follows the selection so text can be styled in place. */}
      {textBubble && (
        <div
          style={{ top: textBubble.top, left: textBubble.left }}
          // Keep the caret: mousedown inside the bubble must not blur the editor.
          onMouseDown={(event) => event.preventDefault()}
          className="absolute z-30 flex -translate-x-1/2 -translate-y-full items-center gap-0.5 bg-gray-900 px-1.5 py-1"
        >
          {(
            [
              { command: 'bold', icon: Bold, title: 'Bold' },
              { command: 'italic', icon: Italic, title: 'Italic' },
              { command: 'underline', icon: Underline, title: 'Underline' },
              { command: 'strikeThrough', icon: Strikethrough, title: 'Strikethrough' },
            ] as const
          ).map(({ command, icon: Icon, title }) => (
            <button
              key={command}
              type="button"
              title={title}
              onClick={() => run(command)}
              className={`${BUBBLE_BUTTON} ${activeMarks[command] ? 'bg-white/20 text-white' : ''}`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}

          <span className="mx-1 h-5 w-px bg-white/20" />

          <button
            type="button"
            title="Heading 2"
            onClick={() => run('formatBlock', 'h2')}
            className={BUBBLE_BUTTON}
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => run('formatBlock', 'h3')}
            className={BUBBLE_BUTTON}
          >
            <Heading3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Quote"
            onClick={() => run('formatBlock', 'blockquote')}
            className={BUBBLE_BUTTON}
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Code block"
            onClick={() => run('formatBlock', 'pre')}
            className={BUBBLE_BUTTON}
          >
            <Code2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Bullet list"
            onClick={() => run('insertUnorderedList')}
            className={`${BUBBLE_BUTTON} ${
              activeMarks.insertUnorderedList ? 'bg-white/20 text-white' : ''
            }`}
          >
            <List className="h-4 w-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-white/20" />

          <button
            type="button"
            title="Insert link"
            onClick={() => {
              const url = window.prompt('Enter URL:');
              if (url) run('createLink', url);
            }}
            className={BUBBLE_BUTTON}
          >
            <Link2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Clear formatting"
            onClick={() => run('removeFormat')}
            className={BUBBLE_BUTTON}
          >
            <Eraser className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Same idea for a clicked image, anchored to the element itself. */}
      {selectedImage && imageBubble && (
        <div
          style={{ top: imageBubble.top, left: imageBubble.left }}
          onMouseDown={(event) => event.preventDefault()}
          className="absolute z-30 flex -translate-x-1/2 -translate-y-full items-center gap-1 bg-gray-900 px-2 py-1 text-xs text-gray-200"
        >
          {(['25%', '50%', '75%', '100%'] as const).map((width) => (
            <button
              key={width}
              type="button"
              onClick={() => applyImageWidth(width)}
              className={`px-1.5 py-1 transition-colors hover:bg-white/15 hover:text-white ${
                imageWidth === width ? 'bg-white/20 text-white' : ''
              }`}
            >
              {width}
            </button>
          ))}

          <span className="mx-1 h-5 w-px bg-white/20" />

          <button
            type="button"
            title="Align left"
            onClick={() => applyImageAlign('left')}
            className={BUBBLE_BUTTON}
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Align center"
            onClick={() => applyImageAlign('center')}
            className={BUBBLE_BUTTON}
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Align right"
            onClick={() => applyImageAlign('right')}
            className={BUBBLE_BUTTON}
          >
            <AlignRight className="h-4 w-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-white/20" />

          <button
            type="button"
            title="Remove image"
            onClick={() => {
              selectedImage.remove();
              selectImage(null);
              emitChange();
            }}
            className={`${BUBBLE_BUTTON} text-red-300 hover:text-red-200`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
