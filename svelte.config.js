import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';

export default {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'] })],
	compilerOptions: {},
	kit: {
		adapter: adapter()
	}
};
