<script>
  import { tick } from 'svelte';
  import X from 'lucide-svelte/icons/x';
  import List from 'lucide-svelte/icons/list';

  let { url, onclose } = $props();
  let raw = $state('');
  let loading = $state(true);
  let err = $state(null);
  let selected = $state(null);
  let sidebar = $state(false);
  let pane = $state(null);

  $effect(() => {
    if (!url) return;
    loading = true;
    err = null;
    raw = '';
    selected = null;
    sidebar = false;
    fetch(url)
      .then(r => r.text())
      .then(t => { raw = t; loading = false; })
      .catch(() => { err = 'failed to load diff'; loading = false; });
  });

  function classify(line) {
    if (line.startsWith('diff --git ')) return 'filediff';
    if (line.startsWith('index ') || line.startsWith('--- ') || line.startsWith('+++ ') || line.startsWith('new file') || line.startsWith('deleted file')) return 'header';
    if (line.startsWith('@@')) return 'hunk';
    if (line.startsWith('+')) return 'add';
    if (line.startsWith('-')) return 'del';
    return 'ctx';
  }

  function parsefiles(text) {
    const files = [];
    let cur = null;
    for (const line of text.split('\n')) {
      if (line.startsWith('diff --git ')) {
        if (cur) files.push(cur);
        const m = line.match(/diff --git a\/.+ b\/(.+)/);
        cur = { name: m ? m[1] : 'unknown', lines: [line] };
      } else if (cur) {
        cur.lines.push(line);
      }
    }
    if (cur) files.push(cur);
    return files;
  }

  function counts(lines) {
    let add = 0, del = 0;
    for (const l of lines) {
      if (l.startsWith('+') && !l.startsWith('+++')) add++;
      else if (l.startsWith('-') && !l.startsWith('---')) del++;
    }
    return { add, del };
  }

  let files = $derived(raw ? parsefiles(raw) : []);

  let active = $derived(
    selected !== null
      ? (files[selected]?.lines ?? []).map(l => ({ text: l, cls: classify(l) }))
      : (raw ? raw.split('\n').map(l => ({ text: l, cls: classify(l) })) : [])
  );

  async function pick(i) {
    if (selected === i) {
      const prev = i;
      selected = null;
      await tick();
      const headers = pane?.querySelectorAll('.filediff');
      headers?.[prev]?.scrollIntoView({ block: 'start', behavior: 'instant' });
    } else {
      selected = i;
      await tick();
      if (pane) pane.scrollTop = 0;
    }
  }

  function keydown(e) {
    if (e.key === 'Escape') onclose();
  }
</script>

<svelte:window onkeydown={keydown} />

<div class="overlay" onclick={onclose} role="presentation">
  <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
    <div class="modal-header">
      <div class="header-left">
        <button type="button" class="sidebar-btn" class:on={sidebar} onclick={() => sidebar = !sidebar} title="Toggle file list">
          <List size={14} />
        </button>
        <span class="modal-title">{url.split('/').pop()}</span>
      </div>
      <button type="button" class="close-btn" onclick={onclose}><X size={15} /></button>
    </div>

    {#if loading}
      <div class="msg">loading…</div>
    {:else if err}
      <div class="msg">{err}</div>
    {:else}
      <div class="body">
        {#if sidebar}
          <div class="filelist">
            {#each files as file, i}
              {@const { add, del } = counts(file.lines)}
              <button
                type="button"
                class="fileitem"
                class:active={selected === i}
                onclick={() => pick(i)}
              >
                <span class="fname">{file.name}</span>
                <span class="fcount">
                  {#if add}<span class="fadd">+{add}</span>{/if}
                  {#if del}<span class="fdel">-{del}</span>{/if}
                </span>
              </button>
            {/each}
          </div>
        {/if}
        <div class="diffpane" bind:this={pane}>
          <pre class="diff">{#each active as { text, cls }}<span class="line {cls}">{text}</span>{/each}</pre>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .modal {
    background: var(--card-bg);
    border: 1px solid var(--border-strong);
    border-radius: 12px;
    width: 100%;
    max-width: 900px;
    height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .modal-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-2);
    font-family: var(--font-mono);
  }

  .sidebar-btn,
  .close-btn {
    display: flex;
    align-items: center;
    color: var(--text-3);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 5px;
    line-height: 1;
    transition: background 0.1s, color 0.1s;
  }

  .sidebar-btn:hover,
  .close-btn:hover {
    color: var(--text);
    background: var(--hover-bg);
  }

  .sidebar-btn.on {
    color: var(--text);
    background: var(--border);
  }

  .msg {
    padding: 24px;
    font-size: 14px;
    color: var(--text-3);
    text-align: center;
  }

  .body {
    display: flex;
    flex: 1;
    overflow: hidden;
    min-height: 0;
  }

  .filelist {
    width: 200px;
    flex-shrink: 0;
    border-right: 1px solid var(--border);
    overflow-y: auto;
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .fileitem {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 7px 8px;
    border-radius: 6px;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    font-family: var(--font-sans);
    transition: background 0.1s;
  }

  .fileitem:hover { background: var(--hover-bg); }
  .fileitem.active { background: var(--border); }

  .fname {
    font-size: 12px;
    color: var(--text);
    font-family: var(--font-mono);
    word-break: break-all;
    line-height: 1.4;
  }

  .fcount {
    display: flex;
    gap: 5px;
    font-size: 11px;
    font-family: var(--font-mono);
  }

  .fadd { color: var(--hljs-green); }
  .fdel { color: var(--hljs-red); }

  .diffpane {
    flex: 1;
    overflow: auto;
    min-width: 0;
  }

  .diff {
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.45;
    margin: 0;
    padding: 0;
    background: var(--code-bg);
    white-space: pre;
    min-height: 100%;
  }

  .line {
    display: block;
    padding: 0 18px;
    min-height: 1.45em;
  }

  .filediff {
    background: var(--muted-bg);
    color: var(--text-2);
    font-weight: 600;
    border-top: 1px solid var(--border-strong);
    border-bottom: 1px solid var(--border);
    padding: 6px 18px;
    margin-top: 4px;
  }

  .filediff:first-child { margin-top: 0; border-top: none; }

  .header { color: var(--text-4); background: var(--muted-bg); }
  .hunk { background: rgba(47, 95, 214, 0.06); color: var(--link); }
  .add { background: rgba(80, 161, 79, 0.14); color: var(--hljs-green); }
  .del { background: rgba(228, 86, 73, 0.12); color: var(--hljs-red); }
  .ctx { color: var(--code-text); }

  @media (max-width: 640px) {
    .overlay { padding: 0; align-items: stretch; }

    .modal {
      border-radius: 0;
      max-width: 100%;
      height: 100%;
      border: none;
    }

    .body { flex-direction: column; }

    .filelist {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid var(--border);
      flex-direction: row;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 6px;
      gap: 4px;
      flex-shrink: 0;
    }

    .fileitem {
      flex-direction: row;
      align-items: center;
      white-space: nowrap;
      flex-shrink: 0;
      gap: 6px;
    }

    .fname { word-break: normal; }
  }
</style>
