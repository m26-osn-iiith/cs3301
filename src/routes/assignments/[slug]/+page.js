import { assignments } from '$lib/data/assignments.js';
import { error } from '@sveltejs/kit';

export function entries() {
  return assignments.map(a => ({ slug: a.id }));
}

export function load({ params }) {
  const idx = assignments.findIndex(a => a.id === params.slug);
  if (idx === -1) throw error(404);
  return {
    assignment: assignments[idx],
    prev: assignments[idx - 1] ?? null,
    next: assignments[idx + 1] ?? null,
  };
}
