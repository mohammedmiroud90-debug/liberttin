'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/components/auth/AuthProvider';
import { userDisplayName } from '@/lib/blog/auth';
import { deleteComment, getAllComments, type ModerationComment } from '@/lib/blog/comments';

function namesOf(user: { username?: string; email?: string } | null) {
  if (!user) return [];
  return [user.username, user.email, userDisplayName(user as any)]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());
}

export default function SpaceRepliesPage() {
  const { user } = useAuth();
  const [comments, setComments] = useState<ModerationComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    getAllComments(300).then((list) => {
      setComments(list);
      setLoading(false);
    });
  }, []);

  const mine = useMemo(() => {
    const names = namesOf(user);
    return comments.filter((row) => names.includes(row.author.trim().toLowerCase()));
  }, [comments, user]);

  const remove = async (comment: ModerationComment) => {
    if (!user) return;
    setBusyId(comment.id);
    try {
      await deleteComment(comment, user.sessionToken);
      setComments((current) => current.filter((row) => row.id !== comment.id));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="admin-main">
      <h1 className="text-3xl font-bold tracking-tight text-black">Replies</h1>
      <p className="mt-1 text-sm text-gray-600">Comments and replies you posted on Libertta.</p>

      <div className="admin-panel mt-8 overflow-hidden">
        <div className="admin-panel-header">{mine.length} item{mine.length === 1 ? '' : 's'}</div>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-black" />
          </div>
        ) : mine.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-gray-500">No replies yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {mine.map((comment) => (
              <li key={comment.id} className="px-5 py-4">
                <p className="text-sm text-black">{comment.content}</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                  <span>
                    {new Date(comment.createdAt).toLocaleString()}
                    {comment.postId ? (
                      <>
                        {' · '}
                        <Link href={`/blog/${comment.postId}`} className="text-[#2563eb]">
                          View post
                        </Link>
                      </>
                    ) : null}
                  </span>
                  <button
                    type="button"
                    disabled={busyId === comment.id}
                    onClick={() => remove(comment)}
                    className="admin-btn admin-btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
