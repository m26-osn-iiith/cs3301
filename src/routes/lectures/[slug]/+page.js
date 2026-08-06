import { lectures } from '$lib/content.js';
import { error } from '@sveltejs/kit';

const mods = import.meta.glob('/src/content/lectures/*.md');

export function entries() {
	return lectures.map((l) => ({ slug: l.slug }));
}

export async function load({ params }) {
	const path = `/src/content/lectures/${params.slug}.md`;
	if (!mods[path]) throw error(404);
	const idx = lectures.findIndex((l) => l.slug === params.slug);
	const mod = await mods[path]();
	return {
		component: mod.default,
		meta: lectures[idx],
		prev: lectures[idx - 1] ?? null,
		next: lectures[idx + 1] ?? null,
	};
}
