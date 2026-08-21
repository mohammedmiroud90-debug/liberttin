/**
 * Utility to sync comment counts from Comment table to Post records.
 * This ensures the `commentsCount` field in posts reflects the actual number of comments.
 */

import { POST_CLASSES, PARSE_SERVER_URL, parseHeaders } from './config';
import { getCommentCount } from './comments';

/**
 * Updates the commentsCount field for a single post.
 */
export async function updatePostCommentCount(
  postId: string,
  sessionToken?: string
): Promise<boolean> {
  const count = await getCommentCount(postId);

  for (const className of POST_CLASSES) {
    try {
      const response = await fetch(`${PARSE_SERVER_URL}/classes/${className}/${postId}`, {
        method: 'PUT',
        headers: parseHeaders(sessionToken),
        body: JSON.stringify({ commentsCount: count }),
      });

      if (response.ok) {
        console.log(`Updated post ${postId} comment count to ${count}`);
        return true;
      }
    } catch (error) {
      console.error(`Failed to update comment count for ${postId}:`, error);
    }
  }

  return false;
}

/**
 * Syncs comment counts for all published posts.
 * Useful for one-time migration or periodic maintenance.
 */
export async function syncAllCommentCounts(sessionToken?: string): Promise<void> {
  console.log('Starting comment count sync...');

  for (const className of POST_CLASSES) {
    const url = new URL(`${PARSE_SERVER_URL}/classes/${className}`);
    url.searchParams.set('where', JSON.stringify({ status: 'published' }));
    url.searchParams.set('limit', '1000');
    url.searchParams.set('keys', 'objectId');

    try {
      const response = await fetch(url.toString(), {
        headers: parseHeaders(sessionToken),
      });

      if (!response.ok) continue;

      const records = (await response.json())?.results ?? [];
      console.log(`Found ${records.length} posts in ${className}`);

      for (const record of records) {
        await updatePostCommentCount(record.objectId, sessionToken);
      }
    } catch (error) {
      console.error(`Error syncing ${className}:`, error);
    }
  }

  console.log('Comment count sync completed!');
}
