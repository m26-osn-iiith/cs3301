import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

/** exposes the numbered lecture pdfs in static/slides/lec as virtual:slides */
function slides(): Plugin {
	const id = '\0virtual:slides';
	const dir = resolve('static/slides/lec');
	return {
		name: 'slides',
		resolveId: (src) => (src === 'virtual:slides' ? id : undefined),
		load(src) {
			if (src !== id) return;
			const files = readdirSync(dir).filter((f) => /^\d+\.pdf$/.test(f));
			return `export default ${JSON.stringify(files)};`;
		},
		configureServer(server) {
			const reload = (file: string) => {
				if (!file.startsWith(dir) || !file.endsWith('.pdf')) return;
				const mod = server.moduleGraph.getModuleById(id);
				if (mod) server.moduleGraph.invalidateModule(mod);
				server.ws.send({ type: 'full-reload' });
			};
			server.watcher.on('add', reload).on('unlink', reload);
		}
	};
}

export default defineConfig({
	plugins: [slides(), tailwindcss(), sveltekit()]
});
