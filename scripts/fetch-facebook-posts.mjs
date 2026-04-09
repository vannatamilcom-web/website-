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

  const endpoint = new URL(`https://graph.facebook.com/${graphVersion}/${pageId}/published_posts`);
  endpoint.searchParams.set(
    'fields',
    'id,message,created_time,permalink_url,full_picture,status_type,attachments{media_type,media,url,target,title,description,unshimmed_url,subattachments.limit(1){media_type,media,url,target,title,description,unshimmed_url}}'
  );
  endpoint.searchParams.set('limit', String(limit));
  endpoint.searchParams.set('access_token', pageAccessToken);

  console.log(`[facebook] Fetching posts: ${endpoint.origin}/${graphVersion}/${pageId}/published_posts?limit=${limit}`);
  const json = await graphFetch(endpoint.toString());

  const posts = Array.isArray(json?.data) ? json.data : [];
  const normalized = posts.map((post) => {
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
