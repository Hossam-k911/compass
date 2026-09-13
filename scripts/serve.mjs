import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist/compass/browser');
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(root + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      const data = await fs.readFile(file);
      res.setHeader(
        'Content-Type',
        {
          '.html': 'text/html; charset=utf-8',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.svg': 'image/svg+xml',
        }[path.extname(file)] ?? 'application/octet-stream',
      );
      res.end(data);
    } catch {
      res.writeHead(404).end('Not found');
    }
  })
  .listen(8787, '127.0.0.1', () => console.log('Compass preview: http://127.0.0.1:8787'));
