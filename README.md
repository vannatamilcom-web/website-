<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Vannatamil News Website

## Run locally

**Prerequisites:** Node.js 20+

1. Install dependencies: `npm install`
2. Create `.env.local` from `.env.example` and fill values as needed
3. Start dev server: `npm run dev`

## YouTube videos (optional)

This site can show latest videos from your YouTube channel.

- Local dev: set `VITE_YOUTUBE_API_KEY` and `VITE_YOUTUBE_CHANNEL_ID` in `.env.local`
- Alternatively (no env needed): set `youtubeChannelId` in `public/site-config.json` and rebuild/deploy. You can paste either a channel id (`UC...`) or a channel URL like `https://www.youtube.com/channel/UC...`.
- GitHub Pages (GitHub Actions): add repository secrets:
  - `VITE_YOUTUBE_API_KEY`
  - `VITE_YOUTUBE_CHANNEL_ID`
  - `VITE_YOUTUBE_LIVE_VIDEO_ID` (optional)

## Facebook posts (native cards; optional)

This site can show your latest Facebook Page posts as native website cards (no iframe).

- GitHub Pages (GitHub Actions): add repository secrets:
  - `VITE_FACEBOOK_URL` (public link for Navbar/Footer)
  - `VITE_FACEBOOK_PAGE_URL` (public Page URL)
  - `FACEBOOK_PAGE_ID`
  - `FACEBOOK_PAGE_ACCESS_TOKEN`
  - `FACEBOOK_GRAPH_VERSION` (optional)
  - `FACEBOOK_POST_LIMIT` (optional)

## Instagram posts (native cards; optional)

This site can show your latest Instagram posts as native website cards (no iframe).

- GitHub Pages (GitHub Actions): add repository secrets:
  - `INSTAGRAM_ACCESS_TOKEN`
  - `INSTAGRAM_USER_ID` (optional)
  - `INSTAGRAM_GRAPH_VERSION` (optional)
  - `INSTAGRAM_POST_LIMIT` (optional)
