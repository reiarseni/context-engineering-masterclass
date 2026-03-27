// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const site = process.env.SITE || 'https://reiarseni.github.io';
const base = process.env.BASE_URL || '/context-engineering-masterclass';

export default defineConfig({
  integrations: [react()],
  site,
  base,
});
