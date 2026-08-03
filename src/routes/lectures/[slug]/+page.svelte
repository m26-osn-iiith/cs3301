<script>
  let { data } = $props();
  const { lecture, prev, next } = $derived(data);

  function fmtdate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>{lecture.title} — CS3.301</title>
</svelte:head>

<div class="detail">
  <a href="/lectures" class="breadcrumb">Lectures</a>

  <h1 class="title">{lecture.title}</h1>
  <div class="meta">Lecture {lecture.n} · {fmtdate(lecture.date)}</div>

  <p class="summary">{lecture.summary}</p>

  <div class="content-area">
    <!-- markdown content will render here -->
  </div>

  <nav class="prevnext">
    <div>
      {#if prev}
        <a href="/lectures/{prev.id}" class="prevnext-link">
          <span class="prevnext-label">← Previous</span>
          <span class="prevnext-title">{prev.title}</span>
        </a>
      {/if}
    </div>
    <div>
      {#if next}
        <a href="/lectures/{next.id}" class="prevnext-link next">
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
  }

  .breadcrumb {
    font-size: 13.5px;
    color: var(--link);
    text-decoration: none;
    display: inline-block;
    margin-bottom: 16px;
  }

  .breadcrumb:hover {
    color: var(--link-hover);
  }

  .title {
    font-size: 30px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
    margin-bottom: 10px;
  }

  .meta {
    font-size: 13.5px;
    color: var(--text-3);
    margin-bottom: 24px;
  }

  .summary {
    font-size: 15px;
    color: var(--text-2);
    line-height: 1.65;
    margin-bottom: 32px;
  }

  .content-area {
    min-height: 80px;
    margin-bottom: 44px;
  }

  .prevnext {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }

  .prevnext-link {
    display: flex;
    flex-direction: column;
    gap: 3px;
    text-decoration: none;
  }

  .prevnext-link.next {
    text-align: right;
  }

  .prevnext-label {
    font-size: 12px;
    color: var(--text-3);
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
