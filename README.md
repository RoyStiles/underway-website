# SlipMate website

Plain HTML pages for the store listings: home (store buttons + QR codes), Privacy Policy, Terms, Support, Delete account, and `/get` (one QR code that sends iPhones to the App Store and Android phones to Google Play).

## See it on your PC
In PowerShell: `cd G:\Underway\underway-website`, then `npm run preview`, then open http://localhost:8080 in your browser. It rebuilds first, so after editing `pages/` or `config.json`, stop it (Ctrl+C) and run it again.

## Edit and rebuild
1. Edit `config.json` (domain, support email, store links) or a page in `pages/`.
2. In this folder run `npm run build`. It rewrites the `site/` folder and prints anything still missing.
3. Commit and push. GitHub Pages publishes the `site/` folder automatically (see `.github/workflows/pages.yml`). Remember to run `npm run build` first, because `site/` is what goes live.

## Before submitting to the stores
- Set `siteUrl` and `supportEmail` in `config.json` (the page shows `YOUR-DOMAIN` until then).
- Set `appStoreUrl` once Apple gives the app an ID (`https://apps.apple.com/app/id1234567890`). The Apple QR and `/get` QR appear on the next build.
- Have the Privacy Policy and Terms read by a lawyer, and make sure they match the Apple privacy labels and Google Data safety form.

URLs to paste into the stores: Privacy `/privacy.html`, Support `/support.html`, Account deletion (Google) `/delete-account.html`, Terms `/terms.html`.
