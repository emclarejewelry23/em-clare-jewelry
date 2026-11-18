// Shared helpers for the shop's serverless functions.
import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

// Everything the shop saves (catalog + uploaded photos) lives in one Netlify Blobs store.
export function store() {
  const test = process.env.EMC_TEST_BLOBS; // only used for local testing
  if (test) return getStore({ name: "shop", ...JSON.parse(test) });
  return getStore({ name: "shop", consistency: "strong" });
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

export function passwordIsSet() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8);
}

// Changing ADMIN_PASSWORD (or SESSION_SECRET) in Netlify signs everyone out.
function secret() {
  return crypto
    .createHash("sha256")
    .update("emclare:" + (process.env.ADMIN_PASSWORD || "") + ":" + (process.env.SESSION_SECRET || ""))
    .digest();
}

export function passwordMatches(given) {
  const a = crypto.createHash("sha256").update(String(given || "")).digest();
  const b = crypto.createHash("sha256").update(String(process.env.ADMIN_PASSWORD || "")).digest();
  return crypto.timingSafeEqual(a, b);
}

export function makeToken(days = 30) {
  const exp = Date.now() + days * 864e5;
  const sig = crypto.createHmac("sha256", secret()).update(String(exp)).digest("base64url");
  return exp + "." + sig;
}

export function isSignedIn(req) {
  if (!passwordIsSet()) return false;
  const m = /^Bearer (\d{10,16})\.([A-Za-z0-9_-]{20,})$/.exec(req.headers.get("authorization") || "");
  if (!m || Number(m[1]) < Date.now()) return false;
  const want = Buffer.from(crypto.createHmac("sha256", secret()).update(m[1]).digest("base64url"));
  const got = Buffer.from(m[2]);
  return got.length === want.length && crypto.timingSafeEqual(got, want);
}
