import crypto from "node:crypto";
import { json, store, isSignedIn } from "../lib/shop.mjs";

const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
const MAX_BYTES = 5_500_000; // Netlify functions accept about 6 MB per request

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);
  if (!isSignedIn(req)) return json({ error: "Please sign in again." }, 401);

  const type = (req.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  const ext = TYPES[type];
  if (!ext) return json({ error: "Use a JPG, PNG, WebP or GIF photo." }, 415);

  const buf = await req.arrayBuffer();
  if (!buf.byteLength) return json({ error: "The photo was empty." }, 400);
  if (buf.byteLength > MAX_BYTES) return json({ error: "That photo is too large. Try one under 5 MB." }, 413);

  const key = crypto.randomBytes(12).toString("hex") + "." + ext;
  await store().set("img/" + key, buf, { metadata: { contentType: type } });
  return json({ url: "/api/img/" + key });
};

export const config = { path: "/api/upload" };
