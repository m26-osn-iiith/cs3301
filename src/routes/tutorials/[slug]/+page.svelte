<script>
  let { data } = $props();
  const { tutorial, prev, next } = $derived(data);

  function fmtdate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>{tutorial.title} — CS3.301</title>
</svelte:head>

<div class="detail">
  <a href="/tutorials" class="back">← Tutorials</a>

  <div class="detail-header">
    <span class="badge badge-tutorial">Tutorial {tutorial.n}</span>
    <h1 class="detail-title">{tutorial.title}</h1>
    <div class="detail-date">{fmtdate(tutorial.date)}</div>
  </div>

  <p class="detail-summary">{tutorial.summary}</p>

  <div class="content-placeholder">
    <p class="placeholder-text">Tutorial content will appear here.</p>
  </div>

  <nav class="prevnext">
    <div class="prev">
      {#if prev}
        <a href="/tutorials/{prev.id}" class="prevnext-link">
          <span class="prevnext-label">← Previous</span>
          <span class="prevnext-title">{prev.title}</span>
        </a>
      {/if}
    </div>
    <div class="next">
      {#if next}
        <a href="/tutorials/{next.id}" class="prevnext-link">
          <span class="prevnext-label">Next →</span>
          <span class="prevnext-title">{next.title}</span>
        </a>
      {/if}
    </div>
  </nav>
</div>

<style>
  .detail {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .back {
    font-size: 13.5px;
    color: var(--text-3);
    text-decoration: none;
  }

  .back:hover { color: var(--text); }

  .detail-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .detail-title {
    font-size: 26px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.25;
  }

  .detail-date {
    font-size: 13px;
    color: var(--text-3);
    font-family: var(--font-mono);
  }

  .detail-summary {
    font-size: 15px;
    color: var(--text-2);
    line-height: 1.65;
    border-left: 3px solid var(--border-strong);
    padding-left: 16px;
  }

  .content-placeholder {
    min-height: 200px;
    border: 1px dashed var(--border-strong);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--muted-bg);
  }

  .placeholder-text {
    font-size: 13.5px;
    color: var(--text-4);
  }

  .prevnext {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
  }

  .prev { text-align: left; }
  .next { text-align: right; }

  .prevnext-link {
    display: flex;
    flex-direction: column;
    gap: 3px;
    text-decoration: none;
  }

  .prevnext-label {
    font-size: 12px;
    color: var(--text-3);
    font-weight: 500;
  }

  .prevnext-title {
    font-size: 13.5px;
    color: var(--text);
    font-weight: 500;
  }

  .prevnext-link:hover .prevnext-title {
    color: var(--link);
  }
</style>
