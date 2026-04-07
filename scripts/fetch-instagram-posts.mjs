import fs from 'node:fs/promises';
import path from 'node:path';

const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
const igUserId = process.env.INSTAGRAM_USER_ID;
const graphVersion = process.env.INSTAGRAM_GRAPH_VERSION || 'v20.0';
const limit = Number(process.env.INSTAGRAM_POST_LIMIT || 12);

const outputPath = path.join(process.cwd(), 'public', 'instagram-posts.json');

if (!accessToken) {
  const message = '[instagram] Missing INSTAGRAM_ACCESS_TOKEN.';
  console.log(`${message} Writing empty feed.`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
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
  throw new Error(`[instagram] Invalid INSTAGRAM_POST_LIMIT: ${process.env.INSTAGRAM_POST_LIMIT}`);
}

const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username';

const endpoint = igUserId
  ? new URL(`https://graph.facebook.com/${graphVersion}/${igUserId}/media`)
  : new URL('https://graph.instagram.com/me/media');

endpoint.searchParams.set('fields', fields);
endpoint.searchParams.set('limit', String(limit));
endpoint.searchParams.set('access_token', accessToken);

console.log(
  `[instagram] Fetching posts: ${igUserId ? `graph.facebook.com/${graphVersion}/${igUserId}/media` : 'graph.instagram.com/me/media'}?limit=${limit}`
);

try {
  const response = await fetch(endpoint.toString());
  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      json?.error?.message || json?.error?.error_user_msg || JSON.stringify(json) || `${response.status}`;
    throw new Error(`[instagram] API error (${response.status}): ${errorMessage}`);
  }

  const posts = Array.isArray(json?.data) ? json.data : [];
  const normalized = posts.map((post) => ({
    id: post?.id || '',
    caption: post?.caption || '',
    mediaType: post?.media_type || '',
    mediaUrl: post?.media_url || '',
    permalink: post?.permalink || '',
    thumbnailUrl: post?.thumbnail_url || '',
    timestamp: post?.timestamp || '',
    username: post?.username || '',
  }));

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: normalized.length,
        posts: normalized,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(`[instagram] Wrote ${normalized.length} posts to ${outputPath}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: 0,
        posts: [],
        error: message,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(`[instagram] Wrote fallback empty feed to ${outputPath}`);
  process.exit(0);
}
