import { resources } from '$lib/data/resources.js';
import { error } from '@sveltejs/kit';

export function entries() {
  return resources.map(r => ({ slug: r.id }));
}

export function load({ params }) {
  const idx = resources.findIndex(r => r.id === params.slug);
  if (idx === -1) throw error(404);
  return {
    resource: resources[idx],
    prev: resources[idx - 1] ?? null,
    next: resources[idx + 1] ?? null,
  };
}
