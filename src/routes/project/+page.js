const mods = import.meta.glob('/src/content/project.md');

export async function load() {
	const mod = await mods['/src/content/project.md']();
	return { component: mod.default, meta: mod.metadata };
}
