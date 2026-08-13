<script>
  import { onMount } from 'svelte';
  import List from 'lucide-svelte/icons/list';
  import Diffviewer from '$lib/diffviewer.svelte';

  let { children } = $props();
  let ref = $state(null);
  let diffurl = $state(null);
  let toc = $state([]);
  let tocopen = $state(false);
  let closetimer;

  const LINK_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

  function slugify(text) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[\s]+/g, '-');
  }

  function inject(root) {
    root.querySelectorAll('pre.shiki').forEach(block => {
      if (block.parentNode?.classList.contains('code-block')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(block);
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', async () => {
        const text = block.querySelector('code')?.innerText ?? '';
        await navigator.clipboard.writeText(text).catch(() => {});
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1800);
      });
      wrapper.appendChild(btn);
    });

    root.querySelectorAll('h1, h2, h3').forEach(heading => {
      if (heading.dataset.anchored) return;
      heading.dataset.anchored = '1';

      const slug = heading.id || slugify(heading.textContent);
      heading.id = slug;

      const icon = document.createElement('a');
      icon.className = 'anchor-link';
      icon.href = `#${slug}`;
      icon.innerHTML = LINK_ICON;
      icon.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await navigator.clipboard.writeText(location.origin + location.pathname + '#' + slug).catch(() => {});
        icon.classList.add('copied');
        setTimeout(() => icon.classList.remove('copied'), 1200);
      });
      heading.insertBefore(icon, heading.firstChild);

      heading.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        history.pushState(null, '', '#' + slug);
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    toc = Array.from(root.querySelectorAll('h1, h2, h3')).map(h => ({
      id: h.id,
      text: h.textContent.trim(),
      level: parseInt(h.tagName[1]),
    }));
  }

  onMount(() => {
    if (!ref) return;
    inject(ref);
    const observer = new MutationObserver(() => inject(ref));
    observer.observe(ref, { childList: true, subtree: true });

    ref.addEventListener('click', (e) => {
      const btn = e.target.closest('.diff-viewer-btn');
      if (btn) {
        e.preventDefault();
        diffurl = btn.dataset.href;
      }
    });

    return () => observer.disconnect();
  });

  function opentoc() {
    clearTimeout(closetimer);
    tocopen = true;
  }

  function closetoc() {
    closetimer = setTimeout(() => { tocopen = false; }, 150);
  }

  function tocnav(id) {
    tocopen = false;
    const el = document.getElementById(id);
    if (el) {
      history.pushState(null, '', '#' + id);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
</script>

<div bind:this={ref} class="prose">
  {@render children()}
</div>

{#if toc.length > 1}
  <div
    class="toc-wrap"
    onmouseenter={opentoc}
    onmouseleave={closetoc}
  >
    <button type="button" class="toc-btn" aria-label="Table of contents">
      <List size={14} />
    </button>
    {#if tocopen}
      <nav class="toc-panel">
        {#each toc as item}
          <a
            href="#{item.id}"
            class="toc-item"
            class:l2={item.level === 2}
            class:l3={item.level === 3}
            onclick={(e) => { e.preventDefault(); tocnav(item.id); }}
          >{item.text}</a>
        {/each}
      </nav>
    {/if}
  </div>
{/if}

{#if diffurl}
  <Diffviewer url={diffurl} onclose={() => diffurl = null} />
{/if}

<style>
  .toc-wrap {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 30;
  }

  .toc-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--card-bg);
    color: var(--text-3);
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    transition: border-color 0.12s, color 0.12s;
  }

  .toc-btn:hover {
    border-color: var(--border-strong);
    color: var(--text);
  }

  .toc-panel {
    position: absolute;
    top: 0;
    right: 38px;
    width: 220px;
    max-height: 70vh;
    overflow-x: hidden;
    overflow-y: auto;
    background: var(--card-bg);
    border: 1px solid var(--border-strong);
    border-radius: 10px;
    padding: 6px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 1px;
    scrollbar-width: thin;
    scrollbar-color: var(--border-strong) transparent;
  }

  .toc-panel::-webkit-scrollbar {
    width: 4px;
  }

  .toc-panel::-webkit-scrollbar-track {
    background: transparent;
  }

  .toc-panel::-webkit-scrollbar-thumb {
    background: var(--border-strong);
    border-radius: 9999px;
  }

  .toc-panel::-webkit-scrollbar-thumb:hover {
    background: var(--text-4);
  }

  .toc-item {
    display: block;
    font-size: 12.5px;
    color: var(--text-2);
    text-decoration: none !important;
    padding: 5px 8px;
    border-radius: 5px;
    line-height: 1.5;
    transition: background 0.1s, color 0.1s;
    white-space: nowrap;
  }

  .toc-item:hover {
    background: var(--hover-bg);
    color: var(--text);
  }

  .toc-item.l2 { padding-left: 16px; }

  .toc-item.l3 {
    padding-left: 28px;
    font-size: 12px;
    color: var(--text-3);
  }

  @media (max-width: 960px) {
    .toc-wrap { display: none; }
  }
</style>
