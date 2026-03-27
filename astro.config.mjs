// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// GitHub Pages config:
// ASTRO_SITE and ASTRO_BASE are injected automatically by the GitHub Actions
// workflow (actions/configure-pages). For local preview they fall back to
// empty strings so the dev server works without changes.
const site = process.env.ASTRO_SITE;
const base = process.env.ASTRO_BASE;

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  ...(site ? { site } : {}),
  ...(base ? { base } : {}),
});
