import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

type StoredTokenRecord = {
  pageId: string;
  pageToken: string;
  savedAt: string;
};

type TokenStoreShape = {
  pages: Record<string, StoredTokenRecord>;
};

const DEFAULT_STORE: TokenStoreShape = {
  pages: {},
};

function getStoreFilePath() {
  const configured = process.env.FACEBOOK_TOKEN_STORE_FILE || '.data/facebook-token-store.json';
  return path.isAbsolute(configured) ? configured : path.join(process.cwd(), configured);
}

async function readStore(): Promise<TokenStoreShape> {
  try {
    const raw = await readFile(getStoreFilePath(), 'utf8');
    const parsed = JSON.parse(raw) as TokenStoreShape;
    return parsed?.pages ? parsed : DEFAULT_STORE;
  } catch {
    return DEFAULT_STORE;
  }
}

async function writeStore(store: TokenStoreShape) {
  const filePath = getStoreFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(store, null, 2), 'utf8');
}

// Save the refreshed Page token on the server only.
// Replace this file-based implementation with a database in production.
export async function saveFacebookPageToken(pageId: string, pageToken: string) {
  const store = await readStore();

  store.pages[pageId] = {
    pageId,
    pageToken,
    savedAt: new Date().toISOString(),
  };

  await writeStore(store);

  return store.pages[pageId];
}

// Load the most recent stored Page token.
export async function getStoredFacebookPageToken(pageId: string) {
  const store = await readStore();
  return store.pages[pageId]?.pageToken || process.env.FB_PAGE_TOKEN || null;
}
