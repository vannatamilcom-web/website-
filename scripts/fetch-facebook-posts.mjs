import fs from 'node:fs/promises';
import path from 'node:path';

const pageId = process.env.FACEBOOK_PAGE_ID;
const graphVersion = process.env.FACEBOOK_GRAPH_VERSION || 'v20.0';
const limit = Number(process.env.FACEBOOK_POST_LIMIT || 12);
const configuredPageToken = process.env.FB_PAGE_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const longLivedUserToken = process.env.FB_LONG_TOKEN || process.env.FB_USER_TOKEN;
const shortLivedUserToken = process.env.FB_SHORT_TOKEN;
const appId = process.env.FB_APP_ID;
const appSecret = process.env.FB_APP_SECRET;

const outputPath = path.join(process.cwd(), 'public', 'facebook-posts.json');

function getAttachmentPreview(attachment) {
  if (!attachment || typeof attachment !== 'object') {
    return { mediaType: '', imageUrl: null, title: '', description: '', targetUrl: '' };
  }

  const primaryImage = attachment?.media?.image?.src || null;
  const nested = Array.isArray(attachment?.subattachments?.data) ? attachment.subattachments.data[0] : null;
  const nestedImage = nested?.media?.image?.src || null;

  return {
    mediaType: attachment?.media_type || nested?.media_type || '',
    imageUrl: primaryImage || nestedImage || null,
    title: attachment?.title || nested?.title || '',
    description: attachment?.description || nested?.description || '',
    targetUrl:
      attachment?.unshimmed_url ||
      attachment?.url ||
      attachment?.target?.url ||
      nested?.unshimmed_url ||
      nested?.url ||
      nested?.target?.url ||
      '',
  };
}

function getPostMessage(post, attachmentPreview) {
  const message = typeof post?.message === 'string' ? post.message.trim() : '';
  if (message) return message;

  const title = attachmentPreview.title?.trim() || '';
  const description = attachmentPreview.description?.trim() || '';
  const fallback = [title, description].filter(Boolean).join(' - ');
  if (fallback) return fallback;

  if (attachmentPreview.mediaType === 'video' || attachmentPreview.mediaType === 'share') {
    return 'Watch this Facebook video post.';
  }

  return 'Open this Facebook post.';
}

function normalizeDate(value) {
  const time = value ? Date.parse(value) : Number.NaN;
  return Number.isFinite(time) ? time : 0;
}

function dedupePosts(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?.permalinkUrl || item?.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

if (!pageId) {
  const message = '[facebook] Missing FACEBOOK_PAGE_ID.';
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

async function graphFetch(url) {
  const response = await fetch(url);
  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      json?.error?.message || json?.error?.error_user_msg || JSON.stringify(json) || `${response.status}`;
    throw new Error(`[facebook] Graph API error (${response.status}): ${errorMessage}`);
  }

  return json;
}

async function exchangeForLongLivedUserToken() {
  if (longLivedUserToken) {
    return longLivedUserToken;
  }

  if (!shortLivedUserToken || !appId || !appSecret) {
    return null;
  }

  const exchangeUrl = new URL(`https://graph.facebook.com/${graphVersion}/oauth/access_token`);
  exchangeUrl.searchParams.set('grant_type', 'fb_exchange_token');
  exchangeUrl.searchParams.set('client_id', appId);
  exchangeUrl.searchParams.set('client_secret', appSecret);
  exchangeUrl.searchParams.set('fb_exchange_token', shortLivedUserToken);

  console.log('[facebook] Exchanging FB_SHORT_TOKEN for a long-lived user token.');
  const json = await graphFetch(exchangeUrl.toString());
  return json?.access_token || null;
}

async function resolvePageAccessToken() {
  if (configuredPageToken) {
    console.log('[facebook] Using configured page token from secrets.');
    return configuredPageToken;
  }

  const userToken = await exchangeForLongLivedUserToken();

  if (!userToken) {
    return null;
  }

  const pagesUrl = new URL(`https://graph.facebook.com/${graphVersion}/me/accounts`);
  pagesUrl.searchParams.set('fields', 'id,name,access_token');
  pagesUrl.searchParams.set('access_token', userToken);

  console.log('[facebook] Resolving page token from the user token.');
  const json = await graphFetch(pagesUrl.toString());
  const page = Array.isArray(json?.data) ? json.data.find((entry) => entry?.id === pageId) : null;

  if (!page?.access_token) {
    throw new Error(`[facebook] Could not find page access token for page ${pageId}.`);
  }

  return page.access_token;
}

try {
  const pageAccessToken = await resolvePageAccessToken();

  if (!pageAccessToken) {
    throw new Error(
      '[facebook] Missing Facebook token. Set FB_PAGE_TOKEN, or set FB_LONG_TOKEN, or set FB_SHORT_TOKEN with FB_APP_ID and FB_APP_SECRET.'
    );
  }

  const postsEndpoint = new URL(`https://graph.facebook.com/${graphVersion}/${pageId}/published_posts`);
  postsEndpoint.searchParams.set(
    'fields',
    'id,message,created_time,permalink_url,full_picture,status_type,attachments{media_type,media,url,target,title,description,unshimmed_url,subattachments.limit(1){media_type,media,url,target,title,description,unshimmed_url}}'
  );
  postsEndpoint.searchParams.set('limit', String(limit));
  postsEndpoint.searchParams.set('access_token', pageAccessToken);

  const videosEndpoint = new URL(`https://graph.facebook.com/${graphVersion}/${pageId}/videos`);
  videosEndpoint.searchParams.set('fields', 'id,description,created_time,permalink_url,picture,source,title');
  videosEndpoint.searchParams.set('limit', String(limit));
  videosEndpoint.searchParams.set('access_token', pageAccessToken);

  console.log(`[facebook] Fetching posts: ${postsEndpoint.origin}/${graphVersion}/${pageId}/published_posts?limit=${limit}`);
  console.log(`[facebook] Fetching videos: ${videosEndpoint.origin}/${graphVersion}/${pageId}/videos?limit=${limit}`);

  const [postsJson, videosJson] = await Promise.all([
    graphFetch(postsEndpoint.toString()),
    graphFetch(videosEndpoint.toString()).catch((error) => {
      console.warn(error instanceof Error ? error.message : String(error));
      return { data: [] };
    }),
  ]);

  const posts = Array.isArray(postsJson?.data) ? postsJson.data : [];
  const normalizedPosts = posts.map((post) => {
    const attachment = Array.isArray(post?.attachments?.data) ? post.attachments.data[0] : null;
    const attachmentPreview = getAttachmentPreview(attachment);
    return {
      id: post?.id || '',
      message: getPostMessage(post, attachmentPreview),
      createdTime: post?.created_time || '',
      permalinkUrl: post?.permalink_url || attachmentPreview.targetUrl || '',
      fullPicture: post?.full_picture || attachmentPreview.imageUrl || null,
      mediaType: attachmentPreview.mediaType || post?.status_type || '',
      attachmentTitle: attachmentPreview.title || '',
    };
  });

  const videos = Array.isArray(videosJson?.data) ? videosJson.data : [];
  const normalizedVideos = videos.map((video) => ({
    id: video?.id || '',
    message: (typeof video?.description === 'string' && video.description.trim()) || video?.title || 'Watch this Facebook video.',
    createdTime: video?.created_time || '',
    permalinkUrl: video?.permalink_url || '',
    fullPicture: video?.picture || null,
    mediaType: 'video',
    attachmentTitle: video?.title || '',
  }));

  const normalized = dedupePosts([...normalizedVideos, ...normalizedPosts])
    .sort((a, b) => normalizeDate(b.createdTime) - normalizeDate(a.createdTime))
    .slice(0, limit);

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
