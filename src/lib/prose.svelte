<script>
  import { onMount } from 'svelte';
  import Diffviewer from '$lib/diffviewer.svelte';

  let { children } = $props();
  let ref = $state(null);
  let diffurl = $state(null);

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

    root.querySelectorAll('h1, h2').forEach(heading => {
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
</script>

<div bind:this={ref} class="prose">
  {@render children()}
</div>

{#if diffurl}
  <Diffviewer url={diffurl} onclose={() => diffurl = null} />
{/if}
