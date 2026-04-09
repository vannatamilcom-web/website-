import { NextResponse } from 'next/server';
import { exchangeForLongLivedUserToken, FacebookApiError, fetchManagedPages } from '../../../lib/facebook-graph';
import { saveFacebookPageToken } from '../../../lib/token-store';

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function GET() {
  try {
    const userToken = getRequiredEnv('FB_USER_TOKEN');
    const appId = getRequiredEnv('FB_APP_ID');
    const appSecret = getRequiredEnv('FB_APP_SECRET');
    const pageId = getRequiredEnv('FB_PAGE_ID');

    // Step 1: Exchange the current user token for a long-lived user token.
    const exchanged = await exchangeForLongLivedUserToken({
      appId,
      appSecret,
      userToken,
    });

    // Step 2: List the Pages available to the user and find the configured Page.
    const pages = await fetchManagedPages(exchanged.access_token);
    const page = pages.find((item) => item.id === pageId);

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          error: `Facebook page ${pageId} was not found for this account.`,
        },
        { status: 404 },
      );
    }

    if (!page.access_token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Facebook did not return a page access token.',
        },
        { status: 500 },
      );
    }

    // Step 3: Save the new Page token securely on the server.
    await saveFacebookPageToken(pageId, page.access_token);

    return NextResponse.json({
      success: true,
      pageToken: page.access_token,
    });
  } catch (error) {
    if (error instanceof FacebookApiError) {
      const isAuthError = error.details?.code === 190;

      return NextResponse.json(
        {
          success: false,
          error: isAuthError ? 'Facebook token is invalid or expired.' : error.message,
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
