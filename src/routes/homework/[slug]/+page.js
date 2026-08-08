import { homework } from '$lib/content.js';
import { error } from '@sveltejs/kit';

const mods = import.meta.glob('/src/content/homework/*.md');

export const prerender = true;

export function entries() {
	return homework.map((hw) => ({ slug: hw.slug }));
}

export async function load({ params }) {
	const path = `/src/content/homework/${params.slug}.md`;
	if (!mods[path]) throw error(404);
	const idx = homework.findIndex((hw) => hw.slug === params.slug);
	const mod = await mods[path]();
	return {
		component: mod.default,
		meta: homework[idx],
		prev: homework[idx - 1] ?? null,
		next: homework[idx + 1] ?? null,
	};
}
