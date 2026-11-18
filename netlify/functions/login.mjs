import { json, makeToken, passwordIsSet, passwordMatches } from "../lib/shop.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);
  if (!passwordIsSet()) {
    return json({ error: "The shop password isn't set up yet. Add ADMIN_PASSWORD (8+ characters) in Netlify's environment variables, then redeploy." }, 503);
  }
  let body = {};
  try { body = await req.json(); } catch {}
  if (!passwordMatches(body.password)) {
    await new Promise((r) => setTimeout(r, 900)); // slows down guessing
    return json({ error: "That password isn't right." }, 401);
  }
  return json({ token: makeToken(30) });
};

export const config = { path: "/api/login" };
