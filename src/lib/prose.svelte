<script>
  import { onMount } from 'svelte';
  let { children } = $props();
  let ref = $state(null);

  onMount(() => {
    if (!ref) return;
    ref.querySelectorAll('pre.shiki').forEach(block => {
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
  });
</script>

<div bind:this={ref} class="prose">
  {@render children()}
</div>
