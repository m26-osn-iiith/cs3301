<script>
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { onMount, tick } from 'svelte';
  import SearchIcon from 'lucide-svelte/icons/search';
  import X from 'lucide-svelte/icons/x';

  let { open = $bindable(false) } = $props();

  let query = $state('');
  let results = $state([]);
  let loading = $state(false);
  let selected = $state(-1);
  let error = $state('');
  let inputEl = $state(null);
  let debounce = null;
  let pf = null;

  async function loadpf() {
    if (pf) return pf;
    try {
      const mod = await import(/* @vite-ignore */ `${base}/pagefind/pagefind.js`);
      if (mod.init) await mod.init();
      pf = mod;
      return pf;
    } catch {
      error = 'Search unavailable — run a build first.';
      return null;
    }
  }

  function cleanurl(url) {
    if (!url) return '/';
    let u = url.replace(/\.html(?=#|$)/, '');
    if (u === '/index') u = '/';
    if (u.startsWith('/index#')) u = u.replace('/index#', '/#');
    if (base && !u.startsWith(base)) u = `${base}${u}`;
    return u;
  }

  function category(url) {
    if (url.includes('/lectures')) return 'Lecture';
    if (url.includes('/assignments')) return 'Mini-Project';
    if (url.includes('/tutorials')) return 'Tutorial';
    if (url.includes('/homework')) return 'Homework';
    if (url.includes('/resources')) return 'Resource';
    return 'Page';
  }

  async function search(q) {
    const t = q.trim();
    if (!t) { results = []; loading = false; return; }
    loading = true;
    error = '';
    const engine = await loadpf();
    if (!engine) { loading = false; return; }
    try {
      const res = await engine.search(t);
      const raw = await Promise.all((res?.results ?? []).slice(0, 8).map(r => r.data()));
      results = raw.map(r => ({
        url: cleanurl(r.url),
        title: r.meta?.title || 'Untitled',
        excerpt: r.excerpt,
        cat: category(r.url),
      }));
      selected = results.length ? 0 : -1;
    } catch {
      error = 'Search failed.';
    } finally {
      loading = false;
    }
  }

  function oninput(e) {
    query = e.target.value;
    clearTimeout(debounce);
    debounce = setTimeout(() => search(query), 150);
  }

  function onkeydown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); selected = (selected + 1) % results.length; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selected = (selected - 1 + results.length) % results.length; }
    else if (e.key === 'Enter' && selected >= 0) { e.preventDefault(); pick(results[selected].url); }
    else if (e.key === 'Escape') close();
  }

  function pick(url) {
    close();
    goto(url);
  }

  function close() {
    open = false;
    query = '';
    results = [];
    error = '';
  }

  $effect(() => {
    if (open) tick().then(() => inputEl?.focus());
  });

  onMount(() => {
    function globalkey(e) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        open = !open;
      }
    }
    window.addEventListener('keydown', globalkey);
    return () => window.removeEventListener('keydown', globalkey);
  });
</script>

{#if open}
  <div class="overlay" onclick={close} role="presentation">
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Search">
      <div class="input-row">
        <SearchIcon size={15} class="sicon" />
        <input
          bind:this={inputEl}
          type="text"
          class="input"
          placeholder="Search…"
          value={query}
          {oninput}
          {onkeydown}
          autocomplete="off"
          spellcheck="false"
        />
        {#if query}
          <button type="button" class="clear" onclick={() => { query = ''; results = []; inputEl?.focus(); }}><X size={13} /></button>
        {:else}
          <kbd>esc</kbd>
        {/if}
      </div>

      {#if error}
        <div class="msg">{error}</div>
      {:else if loading}
        <div class="msg">Searching…</div>
      {:else if query.trim() && !results.length}
        <div class="msg">No results for "{query}"</div>
      {:else if results.length}
        <div class="results">
          {#each results as r, i}
            <a
              href={r.url}
              class="item"
              class:active={i === selected}
              onclick={(e) => { e.preventDefault(); pick(r.url); }}
              onmouseenter={() => selected = i}
            >
              <div class="item-top">
                <span class="item-title">{r.title}</span>
                <span class="item-cat">{r.cat}</span>
              </div>
              {#if r.excerpt}
                <div class="item-excerpt">{@html r.excerpt}</div>
              {/if}
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 100;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 15vh;
  }

  .modal {
    background: var(--card-bg);
    border: 1px solid var(--border-strong);
    border-radius: 12px;
    width: 560px;
    max-width: calc(100vw - 32px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    overflow: hidden;
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
  }

  :global(.sicon) {
    color: var(--text-3);
    flex-shrink: 0;
  }

  .input {
    flex: 1;
    border: none;
    background: none;
    outline: none;
    font-size: 15px;
    color: var(--text);
    font-family: var(--font-sans);
  }

  .input::placeholder { color: var(--text-3); }

  .clear {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-3);
    padding: 2px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .clear:hover { color: var(--text); background: var(--hover-bg); }

  kbd {
    font-size: 11px;
    color: var(--text-4);
    background: var(--hover-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1px 5px;
    font-family: var(--font-sans);
    flex-shrink: 0;
  }

  .msg {
    padding: 20px 16px;
    font-size: 13px;
    color: var(--text-3);
    text-align: center;
  }

  .results {
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: 380px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--border-strong) transparent;
  }

  .results::-webkit-scrollbar { width: 4px; }
  .results::-webkit-scrollbar-track { background: transparent; }
  .results::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 9999px; }

  .item {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 8px 10px;
    border-radius: 7px;
    text-decoration: none;
    transition: background 0.1s;
  }

  .item.active, .item:hover { background: var(--hover-bg); }

  .item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .item-title {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-cat {
    font-size: 10.5px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 4px;
    background: var(--border);
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    flex-shrink: 0;
  }

  .item-excerpt {
    font-size: 12px;
    color: var(--text-3);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  :global(.item-excerpt mark) {
    background: rgba(47, 95, 214, 0.12);
    color: var(--link);
    padding: 0 2px;
    border-radius: 2px;
    font-weight: 500;
  }
</style>
