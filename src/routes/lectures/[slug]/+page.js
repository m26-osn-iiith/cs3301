import { lectures } from '$lib/data/lectures.js';
import { error } from '@sveltejs/kit';

export function entries() {
  return lectures.map(l => ({ slug: l.id }));
}

export function load({ params }) {
  const idx = lectures.findIndex(l => l.id === params.slug);
  if (idx === -1) throw error(404);
  return {
    lecture: lectures[idx],
    prev: lectures[idx - 1] ?? null,
    next: lectures[idx + 1] ?? null,
  };
}
