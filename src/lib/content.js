const lecturemod = import.meta.glob('/src/content/lectures/*.md', { eager: true });
const tutorialmod = import.meta.glob('/src/content/tutorials/*.md', { eager: true });
const assignmod = import.meta.glob('/src/content/assignments/*.md', { eager: true });
const resourcemod = import.meta.glob('/src/content/resources/*.md', { eager: true });

function collect(modules, sortkey = 'slug') {
	return Object.entries(modules)
		.map(([path, mod]) => ({
			slug: path.split('/').pop().replace('.md', ''),
			...mod.metadata,
		}))
		.sort((a, b) => String(a[sortkey] ?? '').localeCompare(String(b[sortkey] ?? ''), undefined, { numeric: true }));
}

export const lectures = collect(lecturemod);
export const tutorials = collect(tutorialmod);
export const assignments = collect(assignmod);
export const resources = collect(resourcemod, 'order');
