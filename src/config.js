const site = import.meta.env.SITE || 'https://reiarseni.github.io';
const base = import.meta.env.BASE_URL || '/context-engineering-masterclass';

export const CONFIG = {
  site,
  base,
  baseSlash: base.endsWith('/') ? base : base + '/',
};
