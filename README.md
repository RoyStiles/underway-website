# SlipMate website

Plain HTML pages for the store listings: home (store buttons + QR codes), Tour the App, User Guides, Privacy Policy, Terms, Support, Delete account, and `/get` (one QR code that sends iPhones to the App Store and Android phones to Google Play). The menu in the title bar is in `pages/_layout.html`, so it is the same on every page.

## Screenshots on Tour the App
Each section of `pages/tour.html` has a slot such as `{{shot:tour-home|caption}}`. Until a picture is added it shows a dashed "Screenshot coming soon" box with the file name it is waiting for.
To add one: save the phone screenshot as `pages/screenshots/<slot name>.webp` (`.png` or `.jpg` also work), for example `pages/screenshots/tour-home.webp`, then run `npm run build`. The build lists the slots still waiting. The slots are: tour-home, tour-offline, tour-setup, tour-vessel, tour-hours, tour-maintenance, tour-parts, tour-safety, tour-float-plan, tour-destinations, tour-fuel, tour-export. The same `{{shot:...}}` slot works on any page.

## Search engines and link previews
- The build writes `site/sitemap.xml` (every page, for Google) and points `robots.txt` at it. Each page gets a canonical link (its one official web address).
- To keep a page online but out of search results and the sitemap, put `<!-- robots: noindex -->` at the top of it (the Delete account page has this).
- The home page carries a short SoftwareApplication description for Google, built in `build.mjs`. The store links are added to it automatically once they are set in `config.json`.
- `pages/share.png` (1200×630) is the picture shown when someone shares a link. Its layout is `share-image.html`. To remake it, open that file in Chrome with the window at 1200×630 and take a screenshot, or ask Claude.

## See it on your PC
In PowerShell: `cd G:\Underway\underway-website`, then `npm run preview`, then open http://localhost:8080 in your browser. It rebuilds first, so after editing `pages/` or `config.json`, stop it (Ctrl+C) and run it again.

## Edit and rebuild
1. Edit `config.json` (domain, support email, store links) or a page in `pages/`.
2. In this folder run `npm run build`. It rewrites the `site/` folder and prints anything still missing.
3. Commit and push. GitHub Pages publishes the `site/` folder automatically (see `.github/workflows/pages.yml`). Remember to run `npm run build` first, because `site/` is what goes live.

## Before submitting to the stores
- Set `siteUrl` and `supportEmail` in `config.json` (the page shows `YOUR-DOMAIN` until then).
- Set `playStoreUrl` to `https://play.google.com/store/apps/details?id=com.underwayapps.slipmate` once the app is live on Google Play (it is blank now, so the site shows "Coming soon").
- Set `appStoreUrl` once Apple gives the app an ID (`https://apps.apple.com/app/id1234567890`). The Apple QR and `/get` QR appear on the next build.
- Have the Privacy Policy and Terms read by a lawyer, and make sure they match the Apple privacy labels and Google Data safety form.

URLs to paste into the stores: Privacy `/privacy.html`, Support `/support.html`, Account deletion (Google) `/delete-account.html`, Terms `/terms.html`.
