import { tutorials } from '$lib/data/tutorials.js';
import { error } from '@sveltejs/kit';

export function entries() {
  return tutorials.map(t => ({ slug: t.id }));
}

export function load({ params }) {
  const idx = tutorials.findIndex(t => t.id === params.slug);
  if (idx === -1) throw error(404);
  return {
    tutorial: tutorials[idx],
    prev: tutorials[idx - 1] ?? null,
    next: tutorials[idx + 1] ?? null,
  };
}
