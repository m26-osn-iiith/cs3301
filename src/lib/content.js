import slidefiles from 'virtual:slides';

const lecturemod = import.meta.glob('/src/content/lectures/*.md', { eager: true });
const tutorialmod = import.meta.glob('/src/content/tutorials/*.md', { eager: true });
const assignmod = import.meta.glob('/src/content/assignments/*.md', { eager: true });
const resourcemod = import.meta.glob('/src/content/resources/*.md', { eager: true });
const homeworkmod = import.meta.glob('/src/content/homework/*.md', { eager: true });

function collect(modules, sortkey = 'slug') {
	return Object.entries(modules)
		.map(([path, mod]) => ({
			slug: path.split('/').pop().replace('.md', ''),
			...mod.metadata,
		}))
		.sort((a, b) => String(a[sortkey] ?? '').localeCompare(String(b[sortkey] ?? ''), undefined, { numeric: true }));
}

/** adds a placeholder lecture for every slide pdf without an md entry */
function withslides(list) {
	const have = new Set(list.map((l) => l.slug));
	const extra = slidefiles
		.map((f) => ({ slug: f.replace('.pdf', '').padStart(2, '0'), slides: `/slides/lec/${f}` }))
		.filter((l) => !have.has(l.slug))
		.map((l) => ({ ...l, title: `Part ${Number(l.slug)}` }));
	return [...list, ...extra].sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }));
}

export const lectures = withslides(collect(lecturemod));
export const tutorials = collect(tutorialmod);
export const assignments = collect(assignmod);
export const resources = collect(resourcemod, 'order');
export const homework = collect(homeworkmod);
