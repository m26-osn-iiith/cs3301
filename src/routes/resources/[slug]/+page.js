import { resources } from '$lib/content.js';
import { error } from '@sveltejs/kit';

const mods = import.meta.glob('/src/content/resources/*.md');

export function entries() {
	return resources.map((r) => ({ slug: r.slug }));
}

export async function load({ params }) {
	const path = `/src/content/resources/${params.slug}.md`;
	if (!mods[path]) throw error(404);
	const idx = resources.findIndex((r) => r.slug === params.slug);
	const mod = await mods[path]();
	return {
		component: mod.default,
		meta: resources[idx],
		prev: resources[idx - 1] ?? null,
		next: resources[idx + 1] ?? null,
	};
}
