<script>
  import { resources } from '$lib/data/resources.js';
</script>

<svelte:head>
  <title>Resources — CS3.301</title>
</svelte:head>

<div class="page-header">
  <h1>Resources</h1>
  <p>Textbooks, reference docs, and tools for the course.</p>
</div>

<div class="list">
  {#each resources as r}
    <a href="/resources/{r.id}" class="card resource-card">
      <div class="card-title">{r.title}</div>
      <div class="card-desc">{r.summary}</div>
    </a>
  {/each}
</div>

<style>
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
