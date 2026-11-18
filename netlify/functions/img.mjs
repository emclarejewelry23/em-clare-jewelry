import { store } from "../lib/shop.mjs";

export default async (req, context) => {
  const key = (context.params && context.params.key) || "";
  if (!/^[a-f0-9]{24}\.(jpg|png|webp|gif)$/.test(key)) return new Response("Not found", { status: 404 });
  const r = await store().getWithMetadata("img/" + key, { type: "arrayBuffer" });
  if (!r) return new Response("Not found", { status: 404 });
  return new Response(r.data, {
    headers: {
      "content-type": (r.metadata && r.metadata.contentType) || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
};

export const config = { path: "/api/img/:key" };
