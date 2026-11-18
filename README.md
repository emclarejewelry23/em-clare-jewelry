# e.m. clare jewelry — website

The shop site for e.m. clare jewelry, hosted on Netlify.

- **Shoppers** browse the collection and pay through a Stripe Payment Link on each piece.
- **Jennifer** taps **Shop login** at the bottom of the site, enters the shop password, and uses the same Manage shop panel she used on Claude: add pieces, upload photos, edit text, then **Publish changes**.
- Her published changes and uploaded photos are saved in Netlify (Netlify Blobs). The site doesn't need to be redeployed when she edits.

## What's in here

| Path | What it is |
| --- | --- |
| `public/index.html` | The whole storefront and the shop manager |
| `public/logo.webp` | Logo |
| `public/seed/` | Starting catalog (Jennifer's 30 pieces) and photos, used until her first publish on Netlify |
| `netlify/functions/` | Small server pieces: login, save the shop, upload photos, serve photos |
| `netlify.toml`, `package.json` | Netlify settings |

## One-time setup (about 20 minutes)

1. **Put the code on GitHub.** Create a private repository named `em-clare-jewelry` and upload this folder's contents, keeping the folder structure.
2. **Create the Netlify site.** At netlify.com, sign up (Jennifer's email is fine, so she owns it), choose **Add new project → Import an existing project → GitHub**, and pick the repository. Leave the build settings as they are and deploy.
3. **Set the shop password.** In Netlify, open the site, then **Project configuration → Environment variables → Add a variable**:
   - Key: `ADMIN_PASSWORD`
   - Value: a password of 8 or more characters that only Jennifer (and you) know
   Then go to **Deploys → Trigger deploy → Deploy project** so the password takes effect.
4. **Test it.** Open the site, tap **Shop login** at the bottom, sign in, change something small, and tap **Publish changes**. Open the site in a private window to confirm shoppers see it.
5. **Connect the domain.** In Netlify, **Domain management → Add a domain**. Buy one through Netlify or point an existing one at Netlify. HTTPS is set up automatically.
6. **Choose a plan.** The Free plan pauses the site if it runs out of monthly credits. For a store, the Personal plan is the safer choice.

Never send the shop password by text or email. Share it in person or by phone, and change it in Netlify (step 3) if it's ever exposed. Changing it signs everyone out.

## Payments (Stripe)

For each piece, Jennifer creates a Stripe Payment Link and pastes it into the piece's **Checkout link** in the shop manager. Recommended settings on each link:

- **Collect customer addresses** → billing and shipping
- **Limit the number of payments** → 1, for one-of-a-kind pieces

Pieces without a link tell shoppers to email her instead.

## Backups

Each publish keeps the previous version under the key `catalog-previous` in the `shop` blob store, viewable in Netlify under **Blobs**.
