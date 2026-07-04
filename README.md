# The Himalayan Guy — Setup Guide

This is a real, working Next.js + Supabase blog. Once deployed, you publish new
posts entirely from **yoursite.com/admin** — no code, no editing files.

Follow these steps once. It takes about 20–30 minutes.

---

## 1. Create a Supabase project (your database + login + image storage)

1. Go to https://supabase.com → sign up → **New Project**.
2. Wait for it to finish setting up (~2 min).
3. Go to **SQL Editor** → **New query** → open `supabase/schema.sql` from this
   folder, paste the whole thing in, click **Run**. This creates all your
   tables, security rules, and the image storage bucket.
4. Go to **Authentication → Users → Add user** and create *your* login:
   your email + a password you choose. This is the only account that will
   ever be able to log into `/admin`.
5. Go to **Authentication → Providers → Email** and turn **off** "Allow new
   users to sign up" — so nobody but you can ever create an account.
6. Go to **Project Settings → API**. You'll need three values from this page
   in step 3 below: **Project URL**, **anon public key**, and
   **service_role key** (click "Reveal" to see it).

## 2. Create a Resend account (sends you email notifications)

1. Go to https://resend.com → sign up (free tier: 3,000 emails/month).
2. Go to **API Keys** → create one → copy it.
3. (Optional but recommended) Add and verify your own domain under
   **Domains** so emails come from `you@yourdomain.com` instead of a
   default address — otherwise emails still work, just from a shared
   `resend.dev` address. If you skip this, open `lib/email.js` and leave
   the `from` field as-is; it'll still work in testing.

## 3. Configure your environment variables

Copy `.env.example` to `.env.local` and fill in the values from steps 1–2:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
NOTIFY_EMAIL=Saugat4study@gmail.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 4. Run it locally to check everything works

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you should see the homepage (empty, no posts
yet). Open http://localhost:3000/admin — log in with the email/password you
created in step 1.4. Click **New Post**, write something, click **Publish**.
Go back to the homepage — your post is there automatically.

## 5. Deploy so it's live on the internet

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com → sign up → **New Project** → import that repo.
3. In Vercel's project settings, add the same environment variables from
   `.env.local` (Settings → Environment Variables).
4. Click **Deploy**. Vercel gives you a live URL immediately.
5. (Optional) Add your own domain under Vercel → Settings → Domains, and
   update `NEXT_PUBLIC_SITE_URL` to match.

From this point on: **publishing a blog post never touches code again.**
You log into `/admin`, write, and click Publish.

---

## What you can do from the admin dashboard, day to day

- **New Post** — title, rich text (bold/italic/headings/quotes/lists), drag
  in photos, embed a YouTube video by pasting its link, set a category,
  add tags, upload a featured image, and Publish, Save as Draft, or
  Schedule for a future date.
- **Posts** — edit or delete anything you've published.
- **Comments** — every comment starts "pending" so you can approve it
  before it's public; you also get an email at the address in
  `NOTIFY_EMAIL` the moment someone comments.
- **Newsletter** — see everyone who's subscribed.
- **Messages** — every contact form submission lands here, and you also
  get an email notification instantly.

## What's included vs. what needs a follow-up pass

**Included and working:** blog CRUD, image upload, categories/tags, drafts
and scheduling, comment moderation with email alerts, contact form with
email alerts, newsletter capture, search, SEO metadata + sitemap.xml +
robots.txt, responsive design, secure admin login.

**Not included yet (nice-to-haves from the original brief) — happy to add
any of these next:** Google reCAPTCHA spam filtering on comments (currently
comments just require manual approval, which covers most spam), dark mode
toggle, a visual "places visited" map of Nepal, a site visitor counter,
Google Analytics/Search Console snippets, and comment "like"/reply threading
in the UI (the database already supports replies and likes — just needs the
front-end wired up).

## Project structure

```
app/            → every page (Next.js App Router)
  admin/        → the dashboard (auth-protected by middleware.js)
  api/          → server endpoints for comments, contact, newsletter
components/     → shared UI (PostEditor is the rich text publishing tool)
lib/            → Supabase + email helper functions
supabase/schema.sql → run once in Supabase's SQL editor
middleware.js   → blocks /admin/* unless logged in
```
