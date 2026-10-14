import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { createHighlighter, createCssVariablesTheme } from 'shiki';
import remarkMath from 'remark-math';
import katex from 'katex';

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
	download:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
	questions: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
	doubts:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
};

const RESOURCE_KEYWORDS = {
	'Slides': 'slides',
	'Code': 'code',
	'Recording': 'recording',
	'Notes': 'notes',
	'Answers': 'answers',
	'Patch': 'patch',
	'Doubts': 'doubts',
	'Download': 'download',
	'Questions': 'questions',
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
		if (node.type === 'element' && (node.tagName === 'h1' || node.tagName === 'h2' || node.tagName === 'h3')) {
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
		const attrs = type === 'download' ? ' download' : /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener"' : '';
		return `<a class="resource-tile" href="${href}"${attrs}><span class="resource-icon">${icon}</span><span class="resource-label">${keyword}</span>${sub}</a>`;
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

// escape braces so Svelte's template parser doesn't treat them as expressions
const escapeBraces = (html) => html.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');

// remark-math (v3, to match mdsvex's remark-parse v8) produces math/inlineMath nodes;
// render them with KaTeX here instead of rehype-katex so braces can be escaped
function remarkKatex() {
	function walk(node) {
		node.children?.forEach((child, i) => {
			if (child.type === 'math' || child.type === 'inlineMath') {
				const displayMode = child.type === 'math' || child.data?.hProperties?.className?.includes('math-display');
				const html = katex.renderToString(child.value, { displayMode, throwOnError: false });
				node.children[i] = { type: 'html', value: escapeBraces(html) };
			} else {
				walk(child);
			}
		});
	}

	return (tree) => walk(tree);
}

const CALLOUT_ICONS = {
	note:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
	tip:       `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
	important: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="12" y1="14" x2="12.01" y2="14"/></svg>`,
	warning:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
	caution:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

// GitHub-style alerts: a blockquote starting with [!NOTE], [!TIP], [!IMPORTANT], [!WARNING] or [!CAUTION].
// remark-parse v8 reads the marker as a shortcut linkReference with label "!NOTE".
function remarkCallouts() {
	function walk(node) {
		node.children?.forEach((child) => {
			if (child.type === 'blockquote') {
				const para = child.children?.[0];
				const marker = para?.type === 'paragraph' ? para.children?.[0] : undefined;
				const type = marker?.type === 'linkReference' && marker.label?.startsWith('!') ? marker.label.slice(1).toLowerCase() : undefined;
				if (type && CALLOUT_ICONS[type]) {
					para.children.shift();
					const next = para.children[0];
					if (next?.type === 'text') next.value = next.value.replace(/^\s*\n/, '');
					if (!para.children.length || (para.children.length === 1 && !para.children[0].value?.trim())) child.children.shift();

					const label = type[0].toUpperCase() + type.slice(1);
					child.children.unshift({
						type: 'html',
						value: `<p class="callout-title">${CALLOUT_ICONS[type]}${label}</p>`,
					});
					child.data = { hName: 'div', hProperties: { className: ['callout', `callout-${type}`] } };
				}
			}
			walk(child);
		});
	}

	return (tree) => walk(tree);
}

/** @param {string} code @param {string|undefined} lang */
function highlighter(code, lang) {
	const l = langmap[lang] || lang || 'text';
	const loaded = hl.getLoadedLanguages();
	return escapeBraces(hl.codeToHtml(code, { lang: loaded.includes(l) ? l : 'text', theme: 'css-variables' }));
}

export default {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			highlight: { highlighter },
			remarkPlugins: [remarkMath, remarkKatex, remarkCallouts, remarkResourceLinks],
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
