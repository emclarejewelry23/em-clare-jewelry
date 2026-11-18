import { json, store, isSignedIn } from "../lib/shop.mjs";

const MAX_BYTES = 1_500_000;

function publicView(c) {
  return { ...c, products: (c.products || []).filter((p) => p && !p.hidden) };
}

function valid(d) {
  return d && typeof d === "object" && d.shop && typeof d.shop === "object" &&
    Array.isArray(d.products) && d.products.length <= 500 &&
    d.products.every((p) => p && typeof p === "object" && typeof p.id === "string");
}

export default async (req) => {
  const s = store();

  if (req.method === "GET") {
    const c = await s.get("catalog", { type: "json" });
    if (!c) return json({ error: "No saved catalog yet" }, 404); // the page falls back to /seed/catalog.json
    return json(isSignedIn(req) ? c : publicView(c));
  }

  if (req.method === "PUT") {
    if (!isSignedIn(req)) return json({ error: "Please sign in again." }, 401);
    const text = await req.text();
    if (text.length > MAX_BYTES) return json({ error: "The shop data is too large to save." }, 413);
    let body;
    try { body = JSON.parse(text); } catch { return json({ error: "The shop data couldn't be read." }, 400); }
    if (!valid(body.data)) return json({ error: "The shop data is missing pieces." }, 400);

    const current = await s.get("catalog", { type: "json" });
    if (current && (current.updated || "") !== (body.base || "")) {
      return json({ error: "The shop was changed somewhere else since you opened it.", updated: current.updated }, 409);
    }
    if (current) await s.setJSON("catalog-previous", current); // one-step backup

    const data = { ...body.data, updated: new Date().toISOString() };
    await s.setJSON("catalog", data);
    return json({ updated: data.updated });
  }

  return json({ error: "Use GET or PUT" }, 405);
};

export const config = { path: "/api/catalog" };
