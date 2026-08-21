'use client';

import { useEffect, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { RichEditor } from './RichEditor';
import { AdSlot } from '@/components/blog/AdSlot';
import { useAuth } from '@/components/auth/AuthProvider';
import { userDisplayName } from '@/lib/blog/auth';
import {
  createBlogPost,
  getAllAdminPosts,
  slugify,
  updateBlogPost,
  type AdminPost,
} from '@/lib/blog/admin';
import { uploadImage } from '@/lib/blog/upload';

const CATEGORIES = [
  'Architecture',
  'Artificial Intelligence',
  'Business',
  'Design',
  'Process',
  'Technology',
  'Health',
  'Wellness',
  'Research',
  'Nutrition',
  'Mental Health',
  'General',
];

export function PostForm({ post }: { post?: AdminPost }) {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState(post?.title ?? '');
  const [category, setCategory] = useState(post?.category || 'Technology');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? '');
  const [imageCaption, setImageCaption] = useState(post?.imageCaption ?? '');
  const [adScript, setAdScript] = useState(post?.adScript ?? '');
  const [relatedPosts, setRelatedPosts] = useState<string[]>(post?.relatedPosts ?? []);
  const [allPosts, setAllPosts] = useState<AdminPost[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllAdminPosts().then((posts) =>
      setAllPosts(posts.filter((candidate) => candidate.id !== post?.id))
    );
  }, [post?.id]);

  const toggleRelated = (id: string) =>
    setRelatedPosts((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );

  const handleCoverUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingCover(true);
    try {
      setImageUrl(await uploadImage(file, user?.sessionToken));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Cover upload failed.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('A title and some content are required.');
      return;
    }

    setSaving(true);

    const payload = {
      title: title.trim(),
      content,
      category,
      excerpt: excerpt.trim() || title.trim(),
      slug: post?.slug || slugify(title),
      author: post?.author || userDisplayName(user),
      imageUrl,
      imageCaption,
      adScript,
      relatedPosts,
    };

    try {
      if (post) {
        await updateBlogPost(post.id, payload, {
          className: post.className,
          sessionToken: user?.sessionToken,
        });
      } else {
        await createBlogPost(payload, user?.sessionToken);
      }
      router.push('/admin');
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save the post.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl px-4 py-10">
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Post title"
        className="w-full border-0 bg-transparent text-3xl font-bold text-black outline-none placeholder:text-gray-300 sm:text-4xl"
      />

      <p className="mt-2 text-xs text-gray-500">
        Slug: /blog/{post?.slug || slugify(title) || '…'}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="admin-input"
          >
            {[...new Set([category, ...CATEGORIES])].filter(Boolean).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Excerpt</span>
          <input
            type="text"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            placeholder="Short summary shown in listings"
            className="admin-input"
          />
        </label>
      </div>

      <div className="mt-6">
        <span className="mb-1.5 block text-sm font-medium text-gray-700">Cover image</span>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://…"
            className="admin-input flex-1 min-w-[16rem]"
          />
          <label className="admin-btn admin-btn-outline cursor-pointer">
            {uploadingCover ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleCoverUpload(event.target.files?.[0])}
            />
          </label>
        </div>

        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="mt-3 aspect-[16/9] w-full max-w-md object-cover"
          />
        )}

        <input
          type="text"
          value={imageCaption}
          onChange={(event) => setImageCaption(event.target.value)}
          placeholder="Image caption (optional)"
          className="admin-input mt-3"
        />
      </div>

      <div className="mt-8">
        <span className="mb-1.5 block text-sm font-medium text-gray-700">Content</span>
        <RichEditor value={content} onChange={setContent} />
      </div>

      <details className="admin-panel mt-8 p-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-700">
          Ad slot (optional)
        </summary>
        <p className="mt-2 text-xs text-gray-500">
          Shown directly under the newsletter card on the post. Paste either an image URL
          or an HTML snippet — inline scripts are stripped for safety.
        </p>
        <textarea
          value={adScript}
          onChange={(event) => setAdScript(event.target.value)}
          rows={4}
          placeholder="https://example.com/banner.jpg  —  or  —  <a href='…'><img src='…' /></a>"
          className="admin-input mt-3 font-mono text-xs"
        />

        {adScript.trim() && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="mb-2 text-xs font-medium text-gray-500">Preview</p>
            <AdSlot content={adScript} />
          </div>
        )}
      </details>

      {allPosts.length > 0 && (
        <details className="admin-panel mt-4 p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Related posts ({relatedPosts.length} selected)
          </summary>
          <div className="mt-3 grid max-h-72 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
            {allPosts.map((candidate) => {
              const selected = relatedPosts.includes(candidate.id);
              return (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => toggleRelated(candidate.id)}
                  className={`border px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="line-clamp-2">{candidate.title}</span>
                </button>
              );
            })}
          </div>
        </details>
      )}

      {error && (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-end gap-3">
        <Link href="/admin" className="admin-btn admin-btn-ghost">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="admin-btn admin-btn-primary disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {post ? 'Save changes' : 'Publish'}
        </button>
      </div>
    </form>
  );
}
