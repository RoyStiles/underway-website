// Rebuilds the site, then serves ./site at http://localhost:8080 so images, fonts and QR codes load.
// Run:  npm run preview      Stop with Ctrl+C.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, 'site');
const port = Number(process.env.PORT) || 8080;

execFileSync(process.execPath, [path.join(here, 'build.mjs')], { stdio: 'inherit' });

const types = {
  '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
};

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/index.html';
  if (!path.extname(p)) p += '.html'; // so /get and /privacy work like they will on the host
  const file = path.join(root, path.normalize(p));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return;
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`\nSlipMate site preview: http://localhost:${port}\nPress Ctrl+C to stop.`));
