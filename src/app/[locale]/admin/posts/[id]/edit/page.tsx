'use client';

import { use, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PostForm } from '@/components/admin/PostForm';
import { getAdminPostById, type AdminPost } from '@/lib/blog/admin';

export default function EditPostPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<AdminPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminPostById(id).then((found) => {
      setPost(found);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-gray-900">Post not found</h1>
        <Link href="/admin" className="mt-4 inline-block text-sm text-teal-700 underline">
          Back to all posts
        </Link>
      </div>
    );
  }

  return <PostForm post={post} />;
}
