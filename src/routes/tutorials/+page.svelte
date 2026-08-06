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
  <p>{tutorials.length} tutorials · Fall 2026</p>
</div>

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

<style>
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
