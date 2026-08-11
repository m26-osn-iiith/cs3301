<script>
  import { onMount } from 'svelte';
  import Diffviewer from '$lib/diffviewer.svelte';

  let { children } = $props();
  let ref = $state(null);
  let diffurl = $state(null);

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
