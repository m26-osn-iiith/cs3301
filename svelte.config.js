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
		}),
	],
	kit: {
		adapter: adapter(),
		prerender: {
			handleUnseenRoutes: 'ignore',
		},
	},
};
