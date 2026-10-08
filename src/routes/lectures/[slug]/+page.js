import { lectures } from '$lib/content.js';
import { error } from '@sveltejs/kit';

const mods = import.meta.glob('/src/content/lectures/*.md');

export function entries() {
	return lectures.map((l) => ({ slug: l.slug }));
}

export async function load({ params }) {
	const idx = lectures.findIndex((l) => l.slug === params.slug);
	if (idx === -1) throw error(404);
	const path = `/src/content/lectures/${params.slug}.md`;
	const mod = mods[path] ? await mods[path]() : null;
	return {
		component: mod?.default ?? null,
		meta: lectures[idx],
		prev: lectures[idx - 1] ?? null,
		next: lectures[idx + 1] ?? null,
	};
}
