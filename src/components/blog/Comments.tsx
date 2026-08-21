'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Eye,
  EyeOff,
  Hand,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { CommentBody } from '@/components/blog/CommentBody';
import {
  CommentComposer,
  type CommentComposerHandle,
} from '@/components/blog/CommentComposer';
import { useAuth } from '@/components/auth/AuthProvider';
import { profilePictureUrl, userDisplayName } from '@/lib/blog/auth';
import {
  createBlogComment,
  deleteComment,
  getBlogComments,
  setCommentVisibility,
  type BlogComment,
} from '@/lib/blog/comments';

const COLLAPSE_LENGTH = 220;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function Avatar({ name, src, size = 32 }: { name: string; src?: string; size?: number }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt=""
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-gray-300 font-semibold uppercase text-white"
    >
      {name.charAt(0)}
    </span>
  );
}

function CommentItem({
  comment,
  level,
  replyingTo,
  onToggleReply,
  replyBox,
  moderation,
}: {
  comment: BlogComment;
  level: number;
  replyingTo: string | null;
  onToggleReply: (id: string) => void;
  replyBox: React.ReactNode;
  moderation?: {
    busyId: string | null;
    onToggleVisibility: (comment: BlogComment) => void;
    onDelete: (comment: BlogComment) => void;
  };
}) {
  const [expanded, setExpanded] = useState(false);
  const [clapped, setClapped] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Never truncate a comment containing a snippet — a half-closed fence would
  // render as literal backticks.
  const hasCode = comment.content.includes('```');
  const isLong = !hasCode && comment.content.length > COLLAPSE_LENGTH;
  const body =
    isLong && !expanded ? `${comment.content.slice(0, COLLAPSE_LENGTH).trimEnd()}…` : comment.content;

  const replyCount = comment.replies.length;
  const busy = moderation?.busyId === comment.id;

  return (
    <div className={level > 0 ? 'ml-8 border-l border-gray-200 pl-5' : ''}>
      <article className={`py-6 ${comment.isActive ? '' : 'opacity-60'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Avatar name={comment.author} src={comment.authorProfilePicture} />
            <div className="leading-tight">
              <p className="text-sm text-gray-900">
                {comment.author}
                {!comment.isActive && (
                  <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-800">
                    Hidden
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
            </div>
          </div>

          {moderation && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="p-1 text-gray-500 transition-colors hover:text-gray-900"
                aria-label="Moderate comment"
              >
                {busy ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-5 w-5" />
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      moderation.onToggleVisibility(comment);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {comment.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Hide comment
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Restore comment
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      moderation.onDelete(comment);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <CommentBody content={body} />

        {isLong && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-1 text-[15px] text-gray-600 underline underline-offset-2 hover:text-gray-900"
          >
            Read more
          </button>
        )}

        <div className="mt-3 flex items-center gap-6 text-[13px] text-gray-500">
          <button
            type="button"
            onClick={() => setClapped((value) => !value)}
            className={`inline-flex items-center gap-1.5 transition-colors hover:text-gray-900 ${
              clapped ? 'text-gray-900' : ''
            }`}
          >
            <Hand className="h-4 w-4" strokeWidth={1.75} />
            {clapped ? 1 : 0}
          </button>

          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" strokeWidth={1.75} />
            {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
          </span>

          <button
            type="button"
            onClick={() => onToggleReply(comment.id)}
            className="font-medium text-gray-700 underline underline-offset-2 transition-colors hover:text-gray-900"
          >
            Reply
          </button>
        </div>

        {replyingTo === comment.id && <div className="mt-4">{replyBox}</div>}
      </article>

      {comment.replies.map((reply) => (
        <div key={reply.id} className="border-t border-gray-100">
          <CommentItem
            comment={reply}
            level={level + 1}
            replyingTo={replyingTo}
            onToggleReply={onToggleReply}
            replyBox={replyBox}
            moderation={moderation}
          />
        </div>
      ))}
    </div>
  );
}

export function Comments({ postId }: { postId: string }) {
  const { user, isAuthenticated, isAdmin, openSignIn } = useAuth();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [moderatingId, setModeratingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const composerRef = useRef<CommentComposerHandle>(null);

  const load = useCallback(async () => {
    // Moderators also see hidden comments so they can restore them.
    const fetched = await getBlogComments(postId, { includeHidden: isAdmin });
    setComments(fetched);
    setLoading(false);
  }, [postId, isAdmin]);

  const handleToggleVisibility = async (comment: BlogComment) => {
    setModeratingId(comment.id);
    setError('');
    try {
      await setCommentVisibility(comment, !comment.isActive, user?.sessionToken);
      await load();
    } catch (moderationError) {
      setError(
        moderationError instanceof Error ? moderationError.message : 'Moderation failed.'
      );
    } finally {
      setModeratingId(null);
    }
  };

  const handleDelete = async (comment: BlogComment) => {
    if (!window.confirm('Delete this comment permanently?')) return;

    setModeratingId(comment.id);
    setError('');
    try {
      await deleteComment(comment, user?.sessionToken);
      await load();
    } catch (moderationError) {
      setError(
        moderationError instanceof Error ? moderationError.message : 'Delete failed.'
      );
    } finally {
      setModeratingId(null);
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (content: string, parentId: string | null) => {
    if (!content.trim()) return;

    if (!isAuthenticated) {
      openSignIn();
      return;
    }

    setSubmitting(true);
    setError('');

    const created = await createBlogComment({
      postId,
      content,
      author: userDisplayName(user),
      authorProfilePicture: profilePictureUrl(user),
      parentId,
      sessionToken: user?.sessionToken,
    });

    if (created) {
      setDraft('');
      setReplyDraft('');
      setReplyingTo(null);
      setComposerOpen(false);
      await load();
    } else {
      setError('Your response could not be posted. Please try again.');
    }

    setSubmitting(false);
  };

  const total = comments.reduce((count, comment) => count + 1 + comment.replies.length, 0);
  const name = userDisplayName(user);

  const replyBox = (
    <div className="border border-gray-200 bg-white p-3">
      <CommentComposer
        compact
        rows={3}
        value={replyDraft}
        onChange={setReplyDraft}
        submitting={submitting}
        onSubmit={() => submit(replyDraft, replyingTo)}
        onCancel={() => {
          setReplyingTo(null);
          setReplyDraft('');
        }}
      />
    </div>
  );

  return (
    <section id="comments" className="bg-white py-14">
      <div className="mx-auto max-w-2xl px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[1.35rem] font-bold text-gray-900">Responses ({total})</h2>
          <button
            type="button"
            className="p-1 text-gray-400 transition-colors hover:text-gray-700"
            aria-label="Response settings"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2.5">
            <Avatar name={isAuthenticated ? name : 'G'} src={profilePictureUrl(user)} />
            <span className="text-sm text-gray-500">
              {isAuthenticated ? `Write a response as ${name}` : 'Write a response'}
            </span>
          </div>

          {composerOpen ? (
            <div className="mt-3">
              <CommentComposer
                ref={composerRef}
                value={draft}
                onChange={setDraft}
                submitting={submitting}
                onSubmit={() => submit(draft, null)}
                onCancel={() => {
                  setComposerOpen(false);
                  setDraft('');
                }}
              />
              {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  openSignIn();
                  return;
                }
                setComposerOpen(true);
                requestAnimationFrame(() => composerRef.current?.focus());
              }}
              className="mt-3 w-full bg-[#f2f2f2] px-4 py-3 text-left text-[15px] text-gray-500 transition-colors hover:bg-[#ebebeb]"
            >
              What are your thoughts?
            </button>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200">
          {loading ? (
            <p className="py-8 text-sm text-gray-500">Loading responses…</p>
          ) : comments.length === 0 ? (
            <p className="py-10 text-sm text-gray-500">
              No responses yet. Be the first to share your thoughts.
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200">
                <CommentItem
                  comment={comment}
                  level={0}
                  replyingTo={replyingTo}
                  onToggleReply={(id) => setReplyingTo(replyingTo === id ? null : id)}
                  replyBox={replyBox}
                  moderation={
                    isAdmin
                      ? {
                          busyId: moderatingId,
                          onToggleVisibility: handleToggleVisibility,
                          onDelete: handleDelete,
                        }
                      : undefined
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
