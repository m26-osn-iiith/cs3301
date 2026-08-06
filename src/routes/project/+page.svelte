<script>
  import Prose from '$lib/prose.svelte';
  let { data } = $props();
  const { component: Content, meta } = $derived(data);
</script>

<svelte:head>
  <title>Course Project — CS3.301</title>
</svelte:head>

<div class="page-header">
  <h1>Course Project</h1>
  <p>{meta.description}</p>
</div>

<Prose>
  <svelte:component this={Content} />
</Prose>
