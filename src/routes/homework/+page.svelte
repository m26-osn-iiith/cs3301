<script>
  import { homework } from '$lib/content.js';

  function fmtdate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>Homework — CS3.301</title>
</svelte:head>

<div class="page-header">
  <h1>Homework</h1>
  <p>Monsoon 2026</p>
</div>

{#if homework.length === 0}
  <div class="empty">No homework yet.</div>
{:else}
  <div class="list">
    {#each homework as hw}
      <a href="/homework/{hw.slug}" class="card hw-card">
        <div class="card-meta">
          <span class="badge badge-homework">HW {hw.n}</span>
          {#if hw.date}<span class="card-date">{fmtdate(hw.date)}</span>{/if}
        </div>
        <div class="card-title">{hw.title}</div>
        {#if hw.summary}<div class="card-desc">{hw.summary}</div>{/if}
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

  .hw-card {
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
