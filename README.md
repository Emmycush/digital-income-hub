# Digital Income Hub — Starter

This is the first static website scaffold for Digital Income Hub. It is separate from CyberSafe Academy and uses plain HTML, CSS, and JavaScript so it can be hosted for free on a static host.

## Files
- `index.html` — responsive homepage
- `styles.css` — shared design system and responsive layout
- `app.js` — expandable category data and mobile navigation
- `about.html`, `contact.html`, `privacy.html`, `disclaimer.html`, `affiliate-disclosure.html`, `terms.html` — initial page drafts

## Run locally
Open `index.html` in a browser, or run a local static server from this folder:
```sh
python -m http.server 8000
```
Then open `http://127.0.0.1:8000`.

## Add a category
Edit the `categories` array in `app.js`. Add an object with:
- `id`: unique, URL-safe identifier
- `icon`: a short text symbol
- `title`: category name
- `description`: one-sentence explanation
- `countLabel`: truthful status label

The homepage generates category cards from this list. This is intentionally expandable; the six initial categories are not a limit.

## Before public launch
1. Choose and connect the final free hosting/repository.
2. Replace the contact placeholder with a working contact method.
3. Review and complete legal pages for actual data practices.
4. Check links, accessibility, mobile layout, and performance.
5. Add real platform guides before promoting the site.
6. Add subscription and subscriber-count features only after selecting a service that genuinely supports them.
7. Never label an ordinary official link as a personal referral link.
8. Do not publish invented subscriber counts, testimonials, or earning claims.

## Current status
Starter scaffold only. No real subscription form, analytics, user accounts, referral tracking, or backend has been connected yet.
