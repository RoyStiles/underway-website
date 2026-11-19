// Builds the SlipMate website into ./site (plain HTML, no server needed).
// Run:  npm run build      (from the website folder)
// It fills {{tokens}} from config.json, wraps each page in pages/_layout.html, and draws the QR codes.
import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const cfg = JSON.parse(fs.readFileSync(path.join(here, 'config.json'), 'utf8'));
const pagesDir = path.join(here, 'pages');
const out = path.join(here, 'site');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'qr'), { recursive: true });

const placeholder = (s) => !s || s.includes('YOUR-DOMAIN');
const warn = [];

// ---- QR codes (SVG: sharp at any size, fine for print) ----
const qrOpts = { type: 'svg', margin: 2, errorCorrectionLevel: 'M', color: { dark: '#16212B', light: '#FFFFFF' } };
const qrs = {
  apple: cfg.appStoreUrl,
  google: cfg.playStoreUrl,
  get: placeholder(cfg.siteUrl) ? '' : `${cfg.siteUrl.replace(/\/$/, '')}/get`,
};
for (const [name, url] of Object.entries(qrs)) {
  if (!url) { warn.push(`No QR for "${name}" yet (its link is blank in config.json).`); continue; }
  fs.writeFileSync(path.join(out, 'qr', `${name}.svg`), await QRCode.toString(url, qrOpts));
}

// ---- Store buttons and QR blocks (live link when set, "coming soon" when not) ----
const badge = (url, label, store) => url
  ? `<a class="store" href="${url}"><span class="small">${store === 'apple' ? 'Download on the' : 'Get it on'}</span><span class="big">${label}</span></a>`
  : `<span class="store soon" aria-disabled="true"><span class="small">Coming soon to</span><span class="big">${label}</span></span>`;
const qrBlock = (key, url, label) => url
  ? `<figure class="qr"><img src="qr/${key}.svg" alt="QR code for ${label}" width="160" height="160"><figcaption>Scan for ${label}</figcaption></figure>`
  : `<figure class="qr off"><div class="qrbox">QR code appears here once the app is live</div><figcaption>${label}</figcaption></figure>`;

const tokens = {
  ...cfg,
  year: new Date().getFullYear(),
  appleBadge: badge(cfg.appStoreUrl, 'App Store', 'apple'),
  googleBadge: badge(cfg.playStoreUrl, 'Google Play', 'google'),
  appleQr: qrBlock('apple', cfg.appStoreUrl, 'the App Store'),
  googleQr: qrBlock('google', cfg.playStoreUrl, 'Google Play'),
  appleHref: cfg.appStoreUrl || '/',
  googleHref: cfg.playStoreUrl || '/',
};
// ---- Screenshot slots: {{shot:tour-home|Caption}} in a page ----
// Shows pages/screenshots/tour-home.webp (or .png / .jpg) when that file exists, and a labeled placeholder box until then.
const shotDir = path.join(pagesDir, 'screenshots');
const shotTypes = ['webp', 'png', 'jpg', 'jpeg'];
const missingShots = [];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const shots = (s) => s.replace(/\{\{shot:([a-z0-9-]+)\|([^}]*)\}\}/g, (_, name, caption) => {
  const ext = shotTypes.find((e) => fs.existsSync(path.join(shotDir, `${name}.${e}`)));
  const cap = caption.trim();
  if (ext) return `<figure class="shot"><img src="screenshots/${name}.${ext}" alt="${esc(cap)}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
  missingShots.push(name);
  return `<figure class="shot" data-shot="${name}"><div class="ph" role="img" aria-label="Screenshot coming soon: ${esc(cap)}"><b>Screenshot coming soon</b><span>${cap}</span><code>screenshots/${name}.webp</code></div></figure>`;
});

const fill = (s) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in tokens ? String(tokens[k]) : `{{${k}}}`));

// ---- Pages ----
const layout = fs.readFileSync(path.join(pagesDir, '_layout.html'), 'utf8');
for (const f of fs.readdirSync(pagesDir)) {
  const src = path.join(pagesDir, f);
  if (f === '_layout.html') continue;
  if (!f.endsWith('.html')) { fs.cpSync(src, path.join(out, f), { recursive: true }); continue; }
  let body = fs.readFileSync(src, 'utf8');
  const meta = {};
  body = body.replace(/^<!--\s*(\w+):\s*(.*?)\s*-->\s*/gm, (_, k, v) => { meta[k] = v; return ''; });
  const page = layout
    .replaceAll('{{pageTitle}}', meta.title ? `${meta.title} · SlipMate` : 'SlipMate: Your boat. Always ready. Wherever you are.')
    .replaceAll('{{pageDescription}}', meta.description ?? 'Service, parts, safety gear, fuel, trips and documents in one place, even with no signal.')
    .replace('{{bodyClass}}', meta.body ?? '')
    .replace('{{content}}', () => shots(body));
  fs.writeFileSync(path.join(out, f), fill(page));
}

// Host helper files
fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nAllow: /\n');
const leftover = [...fs.readdirSync(out)].filter((f) => f.endsWith('.html'))
  .flatMap((f) => (fs.readFileSync(path.join(out, f), 'utf8').match(/\{\{\w+\}\}/g) ?? []).map((t) => `${f}: ${t}`));
if (leftover.length) warn.push(`Unfilled tokens: ${leftover.join(', ')}`);
for (const k of ['siteUrl', 'supportEmail']) if (placeholder(cfg[k])) warn.push(`config.json "${k}" is still a placeholder.`);

if (missingShots.length) warn.push(`${missingShots.length} screenshot slots still show a placeholder (add them to pages/screenshots/): ${missingShots.join(', ')}`);
console.log(`Built ${fs.readdirSync(out).length} items into website/site`);
for (const w of warn) console.log(`  ! ${w}`);
