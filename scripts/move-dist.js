import { mkdirSync, renameSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');
const base = process.env.BASE_URL?.replace(/^\/|\/$/g, '') || 'context-engineering-masterclass';
const basePath = join(dist, base);

if (!existsSync(dist)) {
  console.error('dist folder not found');
  process.exit(1);
}

if (existsSync(basePath)) {
  rmSync(basePath, { recursive: true });
}

mkdirSync(basePath, { recursive: true });

const items = ['_astro', 'index.html'];

for (const item of items) {
  const src = join(dist, item);
  const dest = join(basePath, item);
  if (existsSync(src)) {
    renameSync(src, dest);
    console.log(`Moved ${item} to ${base}`);
  }
}

const folders = ['agentes', 'amnesia', 'anatomia', 'costos', 'elegir-agente', 'facturacion', 'guia', 'index.html', 'interaccion', 'inyeccion', 'loop', 'lost-middle', 'mcp', 'memorias', 'sesion-real', 'skills', 'tool-use', 'favicon.ico', 'favicon.svg'];

for (const folder of folders) {
  const src = join(dist, folder);
  const dest = join(basePath, folder);
  if (existsSync(src)) {
    renameSync(src, dest);
    console.log(`Moved ${folder} to ${base}`);
  }
}

const rootFiles = ['index.html'];
for (const file of rootFiles) {
  const src = join(dist, file);
  if (existsSync(src)) {
    console.log(`${file} already in place`);
  }
}

console.log(`Done! All files moved to ${base}/`);
