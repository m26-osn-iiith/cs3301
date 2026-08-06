<script>
  import { lectures } from '$lib/content.js';

  function fmtdate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>Lectures — CS3.301</title>
</svelte:head>

<div class="page-header">
  <h1>Lectures</h1>
  <p>{lectures.length} lectures · Fall 2026</p>
</div>

<div class="list">
  {#each lectures as lec}
    <a href="/lectures/{lec.slug}" class="card lecture-card">
      <div class="card-meta">
        <span class="badge badge-lecture">Lecture {lec.n}</span>
        <span class="card-date">{fmtdate(lec.date)}</span>
      </div>
      <div class="card-title">{lec.title}</div>
      <div class="card-desc">{lec.summary}</div>
    </a>
  {/each}
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .lecture-card {
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
