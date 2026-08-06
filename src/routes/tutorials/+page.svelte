<script>
  import { tutorials } from '$lib/content.js';

  function fmtdate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>Tutorials — CS3.301</title>
</svelte:head>

<div class="page-header">
  <h1>Tutorials</h1>
  <p>Monsoon 2026</p>
</div>

{#if tutorials.length === 0}
  <div class="empty">No tutorials yet.</div>
{:else}
  <div class="list">
    {#each tutorials as t}
      <a href="/tutorials/{t.slug}" class="card tutorial-card">
        <div class="card-meta">
          <span class="badge badge-tutorial">Tutorial {t.n}</span>
          <span class="card-date">{fmtdate(t.date)}</span>
        </div>
        <div class="card-title">{t.title}</div>
        <div class="card-desc">{t.summary}</div>
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

  .tutorial-card {
    text-decoration: none;
    color: inherit;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .card-date {
    font-size: 12.5px;
    color: var(--text-3);
    font-family: var(--font-mono);
  }
</style>
