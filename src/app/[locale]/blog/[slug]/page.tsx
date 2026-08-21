import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BadgeCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { StyledArticle } from '@/components/blog/StyledArticle';
import { fetchContentSettings } from '@/lib/blog/content-settings';
import { ShareRail } from '@/components/blog/ShareRail';
import { PostCard } from '@/components/blog/PostList';
import { BookmarkButton } from '@/components/blog/BookmarkButton';
import { KeyTakeaways } from '@/components/blog/KeyTakeaways';
import { TopicNav } from '@/components/blog/TopicNav';
import { ReviewFooter } from '@/components/blog/ReviewFooter';
import { ArticleHelpful } from '@/components/blog/ArticleHelpful';
import { Comments } from '@/components/blog/Comments';
import { AuthorByline } from '@/components/blog/AuthorByline';
import { StructuredData } from '@/components/seo/StructuredData';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { processHeadings, extractSources } from '@/lib/blog/headings';
import { categoryPath, tagPath } from '@/lib/blog/config';
import { absoluteAssetUrl, fetchSeoSettings } from '@/lib/blog/seo-settings';
import {
  formatPostDate,
  getBlogPostBySlug,
  getRelatedPosts,
  stripHtml,
} from '@/lib/blog/parse';
import { getTranslations } from 'next-intl/server';

export const revalidate = 60;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const [post, seo] = await Promise.all([getBlogPostBySlug(slug), fetchSeoSettings()]);

  if (!post) return { title: 'Article not found', robots: { index: false, follow: true } };

  const description = post.excerpt || stripHtml(post.content).slice(0, 160);
  const url = `${SITE_URL}/${locale}/blog/${post.slug}`;
  const shareImage = post.imageUrl || absoluteAssetUrl(seo.ogImageUrl);

  return {
    title: post.title,
    description,
    // Posts are not translated, so every locale points at the English URL.
    alternates: {
      canonical: `${SITE_URL}/en/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: [shareImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [shareImage],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('Blog');
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const contentSettings = await fetchContentSettings();
  const seo = await fetchSeoSettings();
  const siblingPosts = await getRelatedPosts(post, 6);
  const relatedPosts = siblingPosts.slice(0, 3);
  const publishedLabel = formatPostDate(post.publishedAt, locale);
  const updatedLabel = post.updatedAt ? formatPostDate(post.updatedAt, locale) : null;

  const { html: articleHtml, headings } = processHeadings(post.content);
  const sources = extractSources(post.content);

  const description = post.excerpt || stripHtml(post.content).slice(0, 160);

  return (
    <>
      <StructuredData
        id="schema-article"
        data={generateArticleSchema({
          title: post.title,
          description,
          slug: post.slug,
          locale,
          image: post.imageUrl,
          author: post.author,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          reviewedBy: post.factChecker,
          fallbackImage: absoluteAssetUrl(seo.ogImageUrl),
        })}
      />
      <StructuredData
        id="schema-breadcrumb"
        data={generateBreadcrumbSchema([
          { name: 'Home', url: `${SITE_URL}/${locale}` },
          { name: post.category, url: `${SITE_URL}/${locale}${categoryPath(post.category)}` },
          { name: post.title, url: `${SITE_URL}/${locale}/blog/${post.slug}` },
        ])}
      />

      <SiteHeader />
      <TopicNav category={post.category} posts={siblingPosts} />
      <ShareRail title={post.title} />

      <main className="flex-1 bg-white">
        {/* Medium-style centered layout */}
        <article className="mx-auto max-w-[680px] px-6 py-8 md:py-12">
          {/* Category and fact-check badge */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Link
              href={categoryPath(post.category)}
              className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline"
            >
              {post.category}
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1 text-[12px] font-medium text-gray-700">
              <BadgeCheck className="h-3.5 w-3.5 text-teal-600" strokeWidth={2} />
              Fact Checked
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-3 text-[2.5rem] font-bold leading-[1.15] tracking-tight text-gray-900 md:text-[3rem] md:leading-[1.1]">
            {post.title}
          </h1>

          {/* Subtitle/excerpt */}
          {post.excerpt && (
            <p className="mb-8 text-[1.35rem] leading-[1.4] text-gray-600">
              {post.excerpt}
            </p>
          )}

          {/* Author byline */}
          <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
            <AuthorByline
              author={post.author}
              avatar={post.authorProfilePicture}
              publishedLabel={publishedLabel}
              updatedLabel={updatedLabel}
              factChecker={post.factChecker}
            />
            <BookmarkButton slug={post.slug} />
          </div>

          {/* Cover image */}
          {post.imageUrl && (
            <figure className="mb-10 -mx-6 md:-mx-12">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imageUrl}
                  alt={post.imageCaption || post.title}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              {post.imageCaption && (
                <figcaption className="mx-6 mt-3 text-center text-sm leading-snug text-gray-500 md:mx-12">
                  {post.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Key takeaways */}
          {post.keyTakeaways.length > 0 && (
            <div className="mb-8">
              <KeyTakeaways items={post.keyTakeaways} />
            </div>
          )}

          {/* Article content */}
          <StyledArticle html={articleHtml} settings={contentSettings} />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-gray-200 pt-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={tagPath(tag)}
                  className="rounded-full bg-gray-100 px-4 py-1.5 text-[14px] text-gray-700 transition-colors hover:bg-gray-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Article helpful widget */}
          <div className="mt-10 border-y border-gray-200 py-8">
            <ArticleHelpful
              postId={post.id}
              postSlug={post.slug}
              postTitle={post.title}
            />
          </div>

          {/* Review footer */}
          <div className="mt-8">
            <ReviewFooter
              title={post.title}
              publishedLabel={publishedLabel}
              updatedLabel={updatedLabel}
              sources={sources}
            />
          </div>
        </article>

        {/* Related posts section */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-200 bg-gray-50 py-14">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="mb-6 text-2xl font-bold text-black">{t('relatedArticles')}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <PostCard key={related.id} post={related} locale={locale} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Comments section */}
        <Comments postId={post.id} />
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
