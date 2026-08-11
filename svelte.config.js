import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { createHighlighter, createCssVariablesTheme } from 'shiki';

const theme = createCssVariablesTheme({
	name: 'css-variables',
	variablePrefix: '--shiki-',
	fontStyle: true,
});

const hl = await createHighlighter({
	themes: [theme],
	langs: ['c', 'cpp', 'bash', 'javascript', 'typescript', 'python', 'makefile', 'text', 'diff'],
});

const langmap = { sh: 'bash', shell: 'bash', js: 'javascript', ts: 'typescript', py: 'python' };

const RESOURCE_ICONS = {
	slides:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
	code:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
	recording: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
	notes:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
	answers:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>`,
	patch:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="12" y1="9" x2="12" y2="15"/></svg>`,
};

const RESOURCE_KEYWORDS = {
	'Slides': 'slides',
	'Code': 'code',
	'Recording': 'recording',
	'Notes': 'notes',
	'Answers': 'answers',
	'Patch': 'patch',
};

function rehypeHeadingIds() {
	function slugify(text) {
		return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
	}

	function text(node) {
		if (node.type === 'text') return node.value;
		return (node.children ?? []).map(text).join('');
	}

	function walk(node) {
		if (node.type === 'element' && (node.tagName === 'h1' || node.tagName === 'h2')) {
			if (!node.properties?.id) {
				node.properties = node.properties ?? {};
				node.properties.id = slugify(text(node));
			}
		}
		node.children?.forEach(walk);
	}

	return (tree) => walk(tree);
}

function remarkResourceLinks() {
	function makeHTML(href, keyword, subtitle) {
		const type = RESOURCE_KEYWORDS[keyword];
		const icon = RESOURCE_ICONS[type];
		const sub = subtitle ? `<span class="resource-sub">${subtitle}</span>` : '';
		if (href.endsWith('.diff')) {
			return `<button type="button" class="resource-tile diff-viewer-btn" data-href="${href}"><span class="resource-icon">${RESOURCE_ICONS.patch}</span><span class="resource-label">${keyword}</span>${sub}</button>`;
		}
		return `<a class="resource-tile" href="${href}"><span class="resource-icon">${icon}</span><span class="resource-label">${keyword}</span>${sub}</a>`;
	}

	function walk(node) {
		if (!node.children) return;
		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i];
			if (child.type === 'paragraph') {
				const real = child.children?.filter(n => !(n.type === 'text' && !n.value.trim()));
				if (real?.length === 1 && real[0].type === 'link') {
					const link = real[0];
					const text = link.children?.map(c => c.value || '').join('') || '';
					const keyword = Object.keys(RESOURCE_KEYWORDS).find(k => text.startsWith(k));
					if (keyword) {
						const subtitle = text.slice(keyword.length).replace(/^[\s\-–—·]+/, '').trim();
						node.children[i] = { type: 'html', value: makeHTML(link.url, keyword, subtitle) };
						continue;
					}
				}
			}
			walk(child);
		}
	}

	return (tree) => walk(tree);
}

/** @param {string} code @param {string|undefined} lang */
function highlighter(code, lang) {
	const l = langmap[lang] || lang || 'text';
	const loaded = hl.getLoadedLanguages();
	const html = hl.codeToHtml(code, { lang: loaded.includes(l) ? l : 'text', theme: 'css-variables' });
	// escape braces so Svelte's template parser doesn't treat them as expressions
	return html.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
}

export default {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			highlight: { highlighter },
			remarkPlugins: [remarkResourceLinks],
			rehypePlugins: [rehypeHeadingIds],
		}),
	],
	kit: {
		adapter: adapter(),
		prerender: {
			handleUnseenRoutes: 'ignore',
		},
	},
};
