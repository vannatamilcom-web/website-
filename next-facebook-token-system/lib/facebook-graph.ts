const GRAPH_VERSION = 'v18.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_VERSION}`;

type GraphErrorPayload = {
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
  };
};

type ExchangeTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type ManagedPage = {
  id: string;
  name: string;
  access_token: string;
};

type ManagedPagesResponse = {
  data?: ManagedPage[];
} & GraphErrorPayload;

type FacebookPostsResponse = {
  data?: Array<Record<string, unknown>>;
  paging?: Record<string, unknown>;
} & GraphErrorPayload;

export class FacebookApiError extends Error {
  status: number;
  details?: GraphErrorPayload['error'];

  constructor(message: string, status = 500, details?: GraphErrorPayload['error']) {
    super(message);
    this.name = 'FacebookApiError';
    this.status = status;
    this.details = details;
  }
}

async function graphFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  const payload = (await response.json()) as T & GraphErrorPayload;

  if (!response.ok || payload?.error) {
    const message =
      payload?.error?.message ||
      `Facebook Graph API request failed with status ${response.status}`;

    throw new FacebookApiError(message, response.status, payload?.error);
  }

  return payload as T;
}

// Exchange an existing user token for a long-lived user token.
export async function exchangeForLongLivedUserToken(params: {
  appId: string;
  appSecret: string;
  userToken: string;
}) {
  const url = new URL(`${GRAPH_BASE_URL}/oauth/access_token`);
  url.searchParams.set('grant_type', 'fb_exchange_token');
  url.searchParams.set('client_id', params.appId);
  url.searchParams.set('client_secret', params.appSecret);
  url.searchParams.set('fb_exchange_token', params.userToken);

  const payload = await graphFetch<ExchangeTokenResponse>(url.toString());

  if (!payload.access_token) {
    throw new FacebookApiError('Facebook did not return a long-lived user token.', 500);
  }

  return payload;
}

// Read the Pages the user manages and extract page access tokens.
export async function fetchManagedPages(longLivedUserToken: string) {
  const url = new URL(`${GRAPH_BASE_URL}/me/accounts`);
  url.searchParams.set('access_token', longLivedUserToken);

  const payload = await graphFetch<ManagedPagesResponse>(url.toString());
  return payload.data || [];
}

// Fetch posts securely using the stored Page token.
export async function fetchFacebookPagePosts(params: {
  pageId: string;
  pageToken: string;
  limit?: number;
}) {
  const url = new URL(`${GRAPH_BASE_URL}/${params.pageId}/posts`);
  url.searchParams.set('access_token', params.pageToken);
  url.searchParams.set('limit', String(params.limit || 10));
  url.searchParams.set('fields', 'id,message,created_time,permalink_url,full_picture');

  return graphFetch<FacebookPostsResponse>(url.toString());
}
