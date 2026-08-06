<script>
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import ChevronRight from 'lucide-svelte/icons/chevron-right';
  import Prose from '$lib/prose.svelte';

  let { data } = $props();
  const { component: Content, meta, prev, next } = $derived(data);

  function fmtdate(d) {
    if (!d) return null;
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>{meta.title} — CS3.301</title>
</svelte:head>

<div class="detail">
  <a href="/assignments" class="breadcrumb">Assignments</a>

  <h1 class="title">{meta.title}</h1>
  <div class="meta">
    Assignment {meta.n}
    {#if meta.released}
      · Released {fmtdate(meta.released)} · Due {fmtdate(meta.due)}
    {:else}
      · <span class="unreleased">Not yet released</span>
    {/if}
  </div>

  <p class="summary">{meta.summary}</p>

  <Prose>
    <svelte:component this={Content} />
  </Prose>

  <nav class="prevnext">
    <div>
      {#if prev}
        <a href="/assignments/{prev.slug}" class="prevnext-link">
          <span class="prevnext-label"><ChevronLeft size={13} strokeWidth={2} />Previous</span>
          <span class="prevnext-title">{prev.title}</span>
        </a>
      {/if}
    </div>
    <div>
      {#if next}
        <a href="/assignments/{next.slug}" class="prevnext-link next">
          <span class="prevnext-label">Next<ChevronRight size={13} strokeWidth={2} /></span>
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

  .unreleased {
    font-style: italic;
    color: var(--text-4);
  }

  .summary {
    font-size: 15px;
    color: var(--text-2);
    line-height: 1.65;
    margin-bottom: 36px;
    border-left: 2px solid var(--border-strong);
    padding-left: 16px;
  }

  .prevnext {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 44px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    font-size: 14px;
  }

  .prevnext-link {
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-decoration: none;
  }

  .prevnext-link.next {
    text-align: right;
  }

  .prevnext-label {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    color: var(--text-3);
  }

  .prevnext-link.next .prevnext-label {
    justify-content: flex-end;
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
