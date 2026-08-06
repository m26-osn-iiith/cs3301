const mods = import.meta.glob('/src/content/policy.md');

export async function load() {
	const mod = await mods['/src/content/policy.md']();
	return { component: mod.default, meta: mod.metadata };
}
