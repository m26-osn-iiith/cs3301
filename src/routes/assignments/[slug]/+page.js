import { assignments } from '$lib/content.js';
import { error } from '@sveltejs/kit';

const mods = import.meta.glob('/src/content/assignments/*.md');

export function entries() {
	return assignments.map((a) => ({ slug: a.slug }));
}

export async function load({ params }) {
	const path = `/src/content/assignments/${params.slug}.md`;
	if (!mods[path]) throw error(404);
	const idx = assignments.findIndex((a) => a.slug === params.slug);
	const mod = await mods[path]();
	return {
		component: mod.default,
		meta: assignments[idx],
		prev: assignments[idx - 1] ?? null,
		next: assignments[idx + 1] ?? null,
	};
}
