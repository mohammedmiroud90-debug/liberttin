import { PARSE_SERVER_URL, parseHeaders } from './config';

export const FEEDBACK_CLASS = 'ArticleFeedback';

export type FeedbackVote = 'yes' | 'no';

export type ArticleFeedback = {
  id: string;
  postId: string;
  postSlug?: string;
  postTitle?: string;
  vote: FeedbackVote;
  visitorId?: string;
  createdAt: string;
};

export type FeedbackTotals = {
  yes: number;
  no: number;
  total: number;
};

export type PostFeedbackStat = FeedbackTotals & {
  postId: string;
  postSlug?: string;
  postTitle?: string;
  lastVotedAt?: string;
};

function mapRecord(record: any): ArticleFeedback {
  return {
    id: record.objectId,
    postId: String(record.postId ?? ''),
    postSlug: record.postSlug ? String(record.postSlug) : undefined,
    postTitle: record.postTitle ? String(record.postTitle) : undefined,
    vote: record.vote === 'no' ? 'no' : 'yes',
    visitorId: record.visitorId ? String(record.visitorId) : undefined,
    createdAt: record.createdAt,
  };
}

/** Stable anonymous id so a visitor can change their vote without double-counting. */
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';

  const key = 'billiant_visitor_id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

  window.localStorage.setItem(key, id);
  return id;
}

export async function getPostFeedbackTotals(postId: string): Promise<FeedbackTotals> {
  const empty: FeedbackTotals = { yes: 0, no: 0, total: 0 };
  if (!postId) return empty;

  const url = new URL(`${PARSE_SERVER_URL}/classes/${FEEDBACK_CLASS}`);
  url.searchParams.set('where', JSON.stringify({ postId }));
  url.searchParams.set('keys', 'vote');
  url.searchParams.set('limit', '1000');

  try {
    const response = await fetch(url.toString(), {
      headers: parseHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) return empty;

    const records = (await response.json())?.results ?? [];
    let yes = 0;
    let no = 0;
    for (const record of records) {
      if (record.vote === 'no') no += 1;
      else yes += 1;
    }
    return { yes, no, total: yes + no };
  } catch {
    return empty;
  }
}

export async function getVisitorVote(
  postId: string,
  visitorId: string
): Promise<FeedbackVote | null> {
  if (!postId || !visitorId) return null;

  const url = new URL(`${PARSE_SERVER_URL}/classes/${FEEDBACK_CLASS}`);
  url.searchParams.set('where', JSON.stringify({ postId, visitorId }));
  url.searchParams.set('limit', '1');
  url.searchParams.set('keys', 'vote');

  try {
    const response = await fetch(url.toString(), {
      headers: parseHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const record = (await response.json())?.results?.[0];
    if (!record) return null;
    return record.vote === 'no' ? 'no' : 'yes';
  } catch {
    return null;
  }
}

export async function submitArticleFeedback(input: {
  postId: string;
  postSlug?: string;
  postTitle?: string;
  vote: FeedbackVote;
  visitorId: string;
}): Promise<FeedbackTotals> {
  const { postId, postSlug, postTitle, vote, visitorId } = input;
  if (!postId || !visitorId) {
    throw new Error('Unable to record feedback.');
  }

  // Update an existing vote for this visitor instead of inserting a duplicate.
  const lookup = new URL(`${PARSE_SERVER_URL}/classes/${FEEDBACK_CLASS}`);
  lookup.searchParams.set('where', JSON.stringify({ postId, visitorId }));
  lookup.searchParams.set('limit', '1');

  const existingResponse = await fetch(lookup.toString(), {
    headers: parseHeaders(),
    cache: 'no-store',
  });

  if (existingResponse.ok) {
    const existing = (await existingResponse.json())?.results?.[0];
    if (existing?.objectId) {
      await fetch(`${PARSE_SERVER_URL}/classes/${FEEDBACK_CLASS}/${existing.objectId}`, {
        method: 'PUT',
        headers: parseHeaders(),
        body: JSON.stringify({ vote, postSlug, postTitle }),
      });
      return getPostFeedbackTotals(postId);
    }
  }

  const create = await fetch(`${PARSE_SERVER_URL}/classes/${FEEDBACK_CLASS}`, {
    method: 'POST',
    headers: parseHeaders(),
    body: JSON.stringify({ postId, postSlug, postTitle, vote, visitorId }),
  });

  if (!create.ok) {
    throw new Error('Unable to record feedback.');
  }

  return getPostFeedbackTotals(postId);
}

export async function getAllFeedbackStats(): Promise<{
  overall: FeedbackTotals;
  byPost: PostFeedbackStat[];
  recent: ArticleFeedback[];
}> {
  const url = new URL(`${PARSE_SERVER_URL}/classes/${FEEDBACK_CLASS}`);
  url.searchParams.set('order', '-createdAt');
  url.searchParams.set('limit', '1000');

  const empty = {
    overall: { yes: 0, no: 0, total: 0 },
    byPost: [] as PostFeedbackStat[],
    recent: [] as ArticleFeedback[],
  };

  try {
    const response = await fetch(url.toString(), {
      headers: parseHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) return empty;

    const records = ((await response.json())?.results ?? []).map(mapRecord);
    const byPostMap = new Map<string, PostFeedbackStat>();
    let yes = 0;
    let no = 0;

    for (const row of records) {
      if (row.vote === 'no') no += 1;
      else yes += 1;

      const entry = byPostMap.get(row.postId) ?? {
        postId: row.postId,
        postSlug: row.postSlug,
        postTitle: row.postTitle,
        yes: 0,
        no: 0,
        total: 0,
        lastVotedAt: row.createdAt,
      };

      if (row.vote === 'no') entry.no += 1;
      else entry.yes += 1;
      entry.total += 1;
      if (!entry.postTitle && row.postTitle) entry.postTitle = row.postTitle;
      if (!entry.postSlug && row.postSlug) entry.postSlug = row.postSlug;
      if (!entry.lastVotedAt || row.createdAt > entry.lastVotedAt) {
        entry.lastVotedAt = row.createdAt;
      }

      byPostMap.set(row.postId, entry);
    }

    return {
      overall: { yes, no, total: yes + no },
      byPost: Array.from(byPostMap.values()).sort((a, b) => b.total - a.total),
      recent: records.slice(0, 40),
    };
  } catch {
    return empty;
  }
}
