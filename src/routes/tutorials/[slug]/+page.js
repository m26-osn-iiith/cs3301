import { tutorials } from '$lib/content.js';
import { error } from '@sveltejs/kit';

const mods = import.meta.glob('/src/content/tutorials/*.md');

export const prerender = true;

export function entries() {
	return tutorials.map((t) => ({ slug: t.slug }));
}

export async function load({ params }) {
	const path = `/src/content/tutorials/${params.slug}.md`;
	if (!mods[path]) throw error(404);
	const idx = tutorials.findIndex((t) => t.slug === params.slug);
	const mod = await mods[path]();
	return {
		component: mod.default,
		meta: tutorials[idx],
		prev: tutorials[idx - 1] ?? null,
		next: tutorials[idx + 1] ?? null,
	};
}
