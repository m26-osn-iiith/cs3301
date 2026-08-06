<script>
  import { resources } from '$lib/content.js';
</script>

<svelte:head>
  <title>Resources — CS3.301</title>
</svelte:head>

<div class="page-header">
  <h1>Resources</h1>
  <p>Monsoon 2026</p>
</div>

{#if resources.length === 0}
  <div class="empty">No resources yet.</div>
{:else}
  <div class="list">
    {#each resources as r}
      <a href="/resources/{r.slug}" class="card resource-card">
        <div class="card-title">{r.title}</div>
        <div class="card-desc">{r.summary}</div>
      </a>
    {/each}
  </div>
{/if}

<style>
  .empty {
    border: 1.5px dashed var(--border);
    border-radius: 10px;
    padding: 48px 24px;
    text-align: center;
    color: var(--text-4);
    font-size: 14px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .resource-card {
    text-decoration: none;
    color: inherit;
  }
</style>
