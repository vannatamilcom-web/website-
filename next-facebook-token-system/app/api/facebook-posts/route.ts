import { NextResponse } from 'next/server';
import { FacebookApiError, fetchFacebookPagePosts } from '../../../lib/facebook-graph';
import { getStoredFacebookPageToken } from '../../../lib/token-store';

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function GET() {
  try {
    const pageId = getRequiredEnv('FB_PAGE_ID');
    const pageToken = await getStoredFacebookPageToken(pageId);

    if (!pageToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'No Facebook Page token is available. Refresh the token first.',
        },
        { status: 400 },
      );
    }

    const posts = await fetchFacebookPagePosts({
      pageId,
      pageToken,
      limit: 10,
    });

    return NextResponse.json({
      success: true,
      posts: posts.data || [],
      paging: posts.paging || null,
    });
  } catch (error) {
    if (error instanceof FacebookApiError) {
      const isAuthError = error.details?.code === 190;

      return NextResponse.json(
        {
          success: false,
          error: isAuthError ? 'Stored Facebook Page token is invalid or expired.' : error.message,
          details: error.details,
        },
        { status: isAuthError ? 401 : error.status || 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected server error.',
      },
      { status: 500 },
    );
  }
}
