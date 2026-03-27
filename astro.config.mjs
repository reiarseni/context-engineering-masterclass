// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: import.meta.env.SITE || 'https://reiarseni.github.io',
  base: import.meta.env.BASE_URL || '/context-engineering-masterclass',
});
