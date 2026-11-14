# SlipMate website: project brief for Claude

Public website for the SlipMate app, live at https://underwayapps.com (GitHub Pages, repo `RoyStiles/underway-website`, branch `main`).
It holds the home page, Privacy Policy, Terms, Support, Delete account and `/get`, which are the links the App Store and Google Play ask for.
The app itself lives in a separate, private repo (`RoyStiles/slip-mate`). Nothing from the app goes in here.
Read `README.md` for how to edit and rebuild.

## Brand copy (use these exact words everywhere)

- Name: **SlipMate** (one word, always).
- Tagline: **Your boat. Always ready. Wherever you are.**
- Description: **Service, parts, safety gear, fuel, trips and documents in one place, even with no signal.**
- Used on the home page, the browser-tab title and the search description (`build.mjs`). Do not invent new taglines; ask me first.

## Change history (GitHub issues)

GitHub issues are the full written history of changes to the website, same as in the app repo.

- When a change is committed, create an issue with the `change` label that says in plain English what I asked for and what changed, then close it with the commit it landed in (`gh issue create --label change`, then `gh issue close`).
- One issue per request, not per file. Small follow-up tweaks to the same request go in as a comment on its issue.
- Docs-only changes (`CLAUDE.md`, `README.md`) do not need an issue.
- On this PC `gh` is at `C:\Program Files\GitHub CLI\gh.exe` and may not be on the shell's PATH.

## About the owner (how to talk to me)

- I am not a developer. Explain things in plain English, and say what a command does and why before I run it.
- I use a Windows PC (PowerShell). Give one step at a time, say where to type or click, and say what I should see when it works.
- If something I ask for is a bad idea (breaks a store requirement, exposes something private, breaks the live site), say so directly and suggest a better way.

## Rules that always apply

1. **This repo is public.** Anyone can read every file and every old commit. Never commit `.env`, keys, tokens, personal details, or draft text I would not want public.
2. **Edit `pages/` and `config.json`, never `site/` by hand.** `site/` is generated. After any edit run `npm run build` and commit `site/` together with the source. `site/` is exactly what goes live.
3. **Pushing to `main` publishes the site** within a minute or two (`.github/workflows/pages.yml`). Treat every push as publishing. After a push, check the run succeeded (`gh run list`) and that the live page loads.
4. **A blank store link in `config.json` means "Coming soon".** `appStoreUrl` and `playStoreUrl` stay blank until the app is actually live in that store. Do not add a store link or QR code early. The real Google Play link is noted in `README.md`.
5. **The store-facing pages must stay online and reachable with no login:** `/privacy.html`, `/support.html`, `/delete-account.html`, `/terms.html`. Never rename or remove them, because the store listings point at them.
6. **Legal text must match reality.** Any change to `privacy.html` or `terms.html` must still match the Apple privacy labels and the Google Data safety form. Flag it to me instead of quietly rewording, and remind me a lawyer should read it.
7. **Domain:** `underwayapps.com` is set in GitHub Pages and in `siteUrl` in `config.json`. DNS is at Squarespace (leave the Google email records alone: Support@UnderwayApps.com depends on them). Do not change the domain or DNS without asking me.
8. **No tracking or third-party calls.** Fonts are hosted here on purpose so visitors' browsers never call Google. Do not add analytics, embeds, or external scripts without asking me.

## Windows notes

- Project folder is `G:\Underway\underway-website` (not inside `slip-mate`).
- Windows PowerShell 5.1 adds a hidden marker (BOM) when `Set-Content -Encoding utf8` writes a file, and that breaks `config.json` for the build. Write JSON without a BOM, or use the Edit tool.
- `node_modules/` is not committed. Run `npm install` once in a fresh copy before `npm run build` or `npm run preview`.
- Preview on this PC with `npm run preview`, then open http://localhost:8080.

## Git

- Commit and push only when I ask. Before pushing, say what will go live.
- Never say a change is live until the Pages run has succeeded and the live page shows it.
