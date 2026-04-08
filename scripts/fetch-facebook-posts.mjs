import fs from 'node:fs/promises';
import path from 'node:path';

const pageId = process.env.FACEBOOK_PAGE_ID;
const pageAccessToken = process.env.FB_PAGE_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const graphVersion = process.env.FACEBOOK_GRAPH_VERSION || 'v20.0';
const limit = Number(process.env.FACEBOOK_POST_LIMIT || 12);

const outputPath = path.join(process.cwd(), 'public', 'facebook-posts.json');

if (!pageId || !pageAccessToken) {
  const message = '[facebook] Missing FACEBOOK_PAGE_ID / FB_PAGE_TOKEN.';
  console.log(`${message} Writing empty feed.`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        pageId: pageId || '',
        count: 0,
        posts: [],
        error: message,
      },
      null,
      2
    ),
    'utf8'
  );
  process.exit(0);
}

if (!Number.isFinite(limit) || limit <= 0) {
  throw new Error(`[facebook] Invalid FACEBOOK_POST_LIMIT: ${process.env.FACEBOOK_POST_LIMIT}`);
}

const endpoint = new URL(`https://graph.facebook.com/${graphVersion}/${pageId}/posts`);
endpoint.searchParams.set('fields', 'id,message,created_time,permalink_url,full_picture');
endpoint.searchParams.set('limit', String(limit));
endpoint.searchParams.set('access_token', pageAccessToken);

console.log(`[facebook] Fetching posts: ${endpoint.origin}/${graphVersion}/${pageId}/posts?limit=${limit}`);

try {
  const response = await fetch(endpoint.toString());
  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      json?.error?.message || json?.error?.error_user_msg || JSON.stringify(json) || `${response.status}`;
    throw new Error(`[facebook] Graph API error (${response.status}): ${errorMessage}`);
  }

  const posts = Array.isArray(json?.data) ? json.data : [];
  const normalized = posts.map((post) => ({
    id: post?.id || '',
    message: post?.message || '',
    createdTime: post?.created_time || '',
    permalinkUrl: post?.permalink_url || '',
    fullPicture: post?.full_picture || null,
  }));

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        pageId,
        count: normalized.length,
        posts: normalized,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(`[facebook] Wrote ${normalized.length} posts to ${outputPath}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        pageId,
        count: 0,
        posts: [],
        error: message,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(`[facebook] Wrote fallback empty feed to ${outputPath}`);
  process.exit(0);
}
