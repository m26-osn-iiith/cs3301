<script>
  import { assignments } from '$lib/content.js';

  const today = new Date().toISOString().slice(0, 10);

  function fmtdate(d) {
    if (!d) return null;
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function status(a) {
    if (!a.released) return 'unreleased';
    if (today > a.due) return 'closed';
    return 'open';
  }
</script>

<svelte:head>
  <title>Assignments — CS3.301</title>
</svelte:head>

<div class="page-header">
  <h1>Assignments</h1>
  <p>{assignments.length} assignments · Fall 2026</p>
</div>

<div class="list">
  {#each assignments as a}
    <a href="/assignments/{a.slug}" class="card assign-card">
      <div class="card-meta">
        <span class="badge badge-milestone">Assignment {a.n}</span>
        {#if status(a) === 'unreleased'}
          <span class="status-tag unreleased">Not yet released</span>
        {:else if status(a) === 'closed'}
          <span class="status-tag closed">Closed</span>
        {:else}
          <span class="status-tag open">Open</span>
        {/if}
      </div>
      <div class="card-title">{a.title}</div>
      <div class="card-desc">{a.summary}</div>
      <div class="card-dates">
        {#if a.released}
          <span>Released {fmtdate(a.released)}</span>
        {/if}
        <span>Due {fmtdate(a.due)}</span>
      </div>
    </a>
  {/each}
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .assign-card {
    text-decoration: none;
    color: inherit;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .status-tag {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 5px;
  }

  .status-tag.unreleased {
    color: var(--text-3);
    background: var(--hover-bg);
  }

  .status-tag.open {
    color: #0d8f6e;
    background: #0d8f6e1a;
  }

  .status-tag.closed {
    color: var(--text-4);
    background: var(--hover-bg);
  }

  .card-dates {
    display: flex;
    gap: 16px;
    font-size: 12.5px;
    color: var(--text-3);
    margin-top: 10px;
    font-family: var(--font-mono);
  }
</style>
