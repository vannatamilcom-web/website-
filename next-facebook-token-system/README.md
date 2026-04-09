# Next.js Facebook Token Auto-Refresh

This is a production-style Next.js App Router scaffold for:

- Refreshing a Facebook Page token automatically
- Storing the refreshed Page token on the server
- Fetching Facebook posts from a secure backend route
- Scheduling refresh with Vercel Cron every 50 days

## Folder Structure

```text
next-facebook-token-system/
  app/
    api/
      facebook-posts/
        route.ts
      refresh-facebook-token/
        route.ts
  lib/
    facebook-graph.ts
    token-store.ts
  .env.local.example
  vercel.json
```

## How It Works

1. `/api/refresh-facebook-token`
   - Exchanges the current user token for a long-lived user token
   - Reads managed pages from Facebook Graph API
   - Finds the configured page by `FB_PAGE_ID`
   - Extracts `page.access_token`
   - Saves the new page token securely on the server

2. `/api/facebook-posts`
   - Loads the stored page token from the server-side token store
   - Calls Facebook Graph API for page posts
   - Returns posts JSON to your frontend or other backend jobs

## Token Storage

This scaffold uses a server-side file store for local/dev simulation:

- File path is configured with `FACEBOOK_TOKEN_STORE_FILE`
- Default example path: `.data/facebook-token-store.json`

For production, replace `lib/token-store.ts` with a real database or secret manager:

- PostgreSQL
- Redis / Vercel KV
- AWS Secrets Manager
- GCP Secret Manager
- Azure Key Vault

## Environment Setup

Copy `.env.local.example` to `.env.local` and fill in:

- `FB_USER_TOKEN`
- `FB_APP_ID`
- `FB_APP_SECRET`
- `FB_PAGE_ID`

## Vercel Cron

`vercel.json` schedules:

- `/api/refresh-facebook-token`
- Every 50 days

## Important Security Notes

- Never expose `FB_USER_TOKEN`, `FB_APP_SECRET`, or page tokens in the frontend
- Keep all Facebook API calls that use secrets inside server routes only
- Protect these routes further with auth or cron-only validation if needed
