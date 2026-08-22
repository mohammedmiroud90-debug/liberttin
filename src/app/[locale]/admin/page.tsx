'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Loader2, MessageSquare, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { AdminPanelHeader } from '@/components/admin/AdminRefreshButton';
import { useAuth } from '@/components/auth/AuthProvider';
import { deleteBlogPost, getAllAdminPosts, type AdminPost } from '@/lib/blog/admin';
import { getAllComments } from '@/lib/blog/comments';

type CommentTally = { total: number; hidden: number };

export default function AdminPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [commentCounts, setCommentCounts] = useState<Map<string, CommentTally>>(new Map());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);

    // One comment fetch tallied locally, rather than a request per row.
    const [fetchedPosts, allComments] = await Promise.all([
      getAllAdminPosts(),
      getAllComments(),
    ]);

    const tally = new Map<string, CommentTally>();
    for (const comment of allComments) {
      const entry = tally.get(comment.postId) ?? { total: 0, hidden: 0 };
      entry.total += 1;
      if (!comment.isActive) entry.hidden += 1;
      tally.set(comment.postId, entry);
    }

    setPosts(fetchedPosts);
    setCommentCounts(tally);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (post: AdminPost) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

    setDeletingId(post.id);
    setError('');

    try {
      await deleteBlogPost(post.id, {
        className: post.className,
        sessionToken: user?.sessionToken,
      });
      setPosts((current) => current.filter((candidate) => candidate.id !== post.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = posts.filter((post) =>
    `${post.title} ${post.category}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <main className="admin-main">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content</h1>
          <p className="mt-1 text-sm text-gray-500">Create, edit and remove blog posts.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/space"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-50"
            title="Open Space as a member"
            aria-label="Open Space"
          >
            Space
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            New post
          </Link>
        </div>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search posts…"
        className="mt-6 w-full max-w-sm rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-600"
      />

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="admin-panel mt-6 overflow-hidden">
        <AdminPanelHeader onRefresh={load} refreshing={loading}>
          All posts ({filtered.length})
        </AdminPanelHeader>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-teal-600" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-gray-500">
            {posts.length === 0 ? 'No posts yet.' : 'No posts match that search.'}
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((post) => {
              const tally = commentCounts.get(post.id) ?? { total: 0, hidden: 0 };

              return (
              <li
                key={post.id}
                className="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{post.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {post.category || 'Uncategorized'}
                    {post.publishedAt &&
                      ` · ${new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}`}
                  </p>
                </div>

                <Link
                  href={`/admin/comments?post=${post.id}`}
                  title={
                    tally.hidden > 0
                      ? `${tally.total} comments · ${tally.hidden} hidden`
                      : `${tally.total} comments`
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                    tally.total > 0
                      ? 'bg-gray-100 font-medium text-gray-800 hover:bg-gray-200'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  {tally.total}
                  {tally.hidden > 0 && (
                    <span className="rounded bg-amber-100 px-1.5 text-[11px] font-medium text-amber-800">
                      {tally.hidden} hidden
                    </span>
                  )}
                </Link>

                <div className="flex items-center gap-1">
                  {post.slug && (
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View
                    </Link>
                  )}
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-teal-700 hover:bg-teal-50"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(post)}
                    disabled={deletingId === post.id}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === post.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete
                  </button>
                </div>
              </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
