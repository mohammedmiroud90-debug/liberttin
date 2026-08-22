'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { CornerDownRight, Eye, EyeOff, Loader2, Trash2 } from 'lucide-react';
import { AdminPanelHeader } from '@/components/admin/AdminRefreshButton';
import { useAuth } from '@/components/auth/AuthProvider';
import { profilePictureUrl, userDisplayName } from '@/lib/blog/auth';
import { CommentBody } from '@/components/blog/CommentBody';
import { CommentComposer } from '@/components/blog/CommentComposer';
import {
  createBlogComment,
  deleteComment,
  getAllComments,
  setCommentVisibility,
  type ModerationComment,
} from '@/lib/blog/comments';
import { getAllAdminPosts, type AdminPost } from '@/lib/blog/admin';

type Filter = 'all' | 'visible' | 'hidden';

export default function AdminCommentsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const postFilter = searchParams.get('post');
  const [comments, setComments] = useState<ModerationComment[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [fetchedComments, fetchedPosts] = await Promise.all([
      getAllComments(),
      getAllAdminPosts(),
    ]);
    setComments(fetchedComments);
    setPosts(fetchedPosts);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const postTitles = useMemo(
    () => new Map(posts.map((post) => [post.id, post])),
    [posts]
  );

  const run = async (
    comment: ModerationComment,
    action: () => Promise<void>
  ) => {
    setBusyId(comment.id);
    setError('');
    try {
      await action();
      await load();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Action failed.');
    } finally {
      setBusyId(null);
    }
  };

  const submitReply = async (comment: ModerationComment) => {
    if (!replyDraft.trim()) return;

    setReplying(true);
    setError('');

    // Threads are one level deep, so a reply to a reply attaches to its parent.
    const created = await createBlogComment({
      postId: comment.postId,
      content: replyDraft,
      author: userDisplayName(user),
      authorProfilePicture: profilePictureUrl(user),
      parentId: comment.parentId || comment.id,
      sessionToken: user?.sessionToken,
    });

    if (created) {
      setReplyDraft('');
      setReplyingTo(null);
      await load();
    } else {
      setError('The reply could not be posted.');
    }

    setReplying(false);
  };

  const filtered = comments.filter((comment) => {
    if (postFilter && comment.postId !== postFilter) return false;
    if (filter === 'visible' && !comment.isActive) return false;
    if (filter === 'hidden' && comment.isActive) return false;

    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return `${comment.author} ${comment.content}`.toLowerCase().includes(needle);
  });

  const hiddenCount = comments.filter((comment) => !comment.isActive).length;

  return (
    <main className="admin-main">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black pb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
            Moderation
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">Comments</h1>
          <p className="mt-1 text-sm text-gray-600">
            {comments.length} total · {hiddenCount} hidden
          </p>
        </div>

        {postFilter && (
          <div className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700">
            <span className="truncate">
              Filtered to “{postTitles.get(postFilter)?.title ?? postFilter}”
            </span>
            <Link href="/admin/comments" className="admin-btn admin-btn-ghost">
              Clear
            </Link>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 border border-gray-300 bg-white p-1 text-sm">
          {(['all', 'visible', 'hidden'] as Filter[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`admin-btn capitalize ${
                filter === option ? 'admin-btn-primary' : 'admin-btn-ghost'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search author or text…"
          className="admin-input max-w-xs"
        />
      </div>

      {error && (
        <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="admin-panel mt-6 overflow-hidden">
        <AdminPanelHeader onRefresh={load} refreshing={loading}>
          Comments ({filtered.length})
        </AdminPanelHeader>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-black" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-gray-500">
            No comments match this view.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map((comment) => {
              const post = postTitles.get(comment.postId);
              const busy = busyId === comment.id;

              return (
                <li key={comment.id} className="px-5 py-4 transition-colors hover:bg-[#f7f7f7]">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-black">
                        {comment.author}
                        {!comment.isActive && (
                          <span className="ml-2 bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-800">
                            Hidden
                          </span>
                        )}
                        {comment.parentId && (
                          <span className="ml-2 bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                            Reply
                          </span>
                        )}
                      </p>

                      <div className="text-sm text-gray-700">
                        <CommentBody content={comment.content} />
                      </div>

                      <p className="mt-1.5 text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString('en-US')}
                        {post && ` · on “${post.title}”`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingTo(replyingTo === comment.id ? null : comment.id);
                          setReplyDraft('');
                        }}
                        className="admin-btn admin-btn-ghost"
                      >
                        <CornerDownRight className="h-4 w-4" />
                        Reply
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          run(comment, () =>
                            setCommentVisibility(
                              comment,
                              !comment.isActive,
                              user?.sessionToken
                            )
                          )
                        }
                        className="admin-btn admin-btn-ghost disabled:opacity-50"
                      >
                        {busy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : comment.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        {comment.isActive ? 'Hide' : 'Restore'}
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          if (!window.confirm('Delete this comment permanently?')) return;
                          run(comment, () => deleteComment(comment, user?.sessionToken));
                        }}
                        className="admin-btn admin-btn-danger disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {replyingTo === comment.id && (
                    <div className="mt-3 border border-gray-200 bg-gray-50 p-3">
                      <p className="mb-2 text-xs text-gray-500">
                        Replying to {comment.author} as {userDisplayName(user)}
                      </p>
                      <CommentComposer
                        compact
                        rows={3}
                        value={replyDraft}
                        onChange={setReplyDraft}
                        submitting={replying}
                        submitLabel="Post reply"
                        placeholder="Write your reply…"
                        onSubmit={() => submitReply(comment)}
                        onCancel={() => {
                          setReplyingTo(null);
                          setReplyDraft('');
                        }}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
