import "server-only";
import { SignJWT, importPKCS8 } from "jose";

// Service-account JWT Bearer flow (no OAuth consent screen needed) — see
// https://developers.google.com/identity/protocols/oauth2/service-account.
// Reuses `jose` (already a dependency for admin session JWTs) instead of
// pulling in the much heavier `googleapis`/`google-auth-library` packages
// for what is otherwise two REST calls.
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export function isSearchConsoleConfigured() {
  return Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL &&
      process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY &&
      process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL
  );
}

interface CachedToken {
  token: string;
  expiresAt: number;
}
// Module-level cache: access tokens are valid for an hour and this module is
// called from short-lived request handlers, so a process-wide cache (rather
// than React's per-request cache()) avoids re-signing a JWT on every call.
let cachedToken: CachedToken | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }

  const clientEmail = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY;
  if (!clientEmail || !privateKeyRaw) {
    throw new Error("GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL / GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY are not set.");
  }
  // .env values can't hold literal newlines, so the key is stored with \n
  // escapes and unescaped here before import.
  const privateKey = await importPKCS8(privateKeyRaw.replace(/\\n/g, "\n"), "RS256");

  const now = Math.floor(Date.now() / 1000);
  const assertion = await new SignJWT({ scope: SCOPE })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(clientEmail)
    .setSubject(clientEmail)
    .setAudience(TOKEN_URL)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Google token exchange failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.token;
}

export type SearchAnalyticsDimension = "query" | "page" | "date" | "device" | "country";

export interface SearchAnalyticsRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export async function querySearchAnalytics(options: {
  startDate: string;
  endDate: string;
  dimensions?: SearchAnalyticsDimension[];
  rowLimit?: number;
}): Promise<SearchAnalyticsRow[]> {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;
  if (!siteUrl) throw new Error("GOOGLE_SEARCH_CONSOLE_SITE_URL is not set.");
  const token = await getAccessToken();

  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: options.startDate,
        endDate: options.endDate,
        dimensions: options.dimensions ?? [],
        rowLimit: options.rowLimit ?? 25,
      }),
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(`Search Console query failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { rows?: SearchAnalyticsRow[] };
  return data.rows ?? [];
}
