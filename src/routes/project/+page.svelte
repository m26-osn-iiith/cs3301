<script>
  import { events } from '$lib/data/calendar.js';

  const milestones = events.filter(e => e.route === '/project');

  function fmtdate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const typelabel = { deadline: 'Deadline', exam: 'Exam', milestone: 'Milestone' };
</script>

<svelte:head>
  <title>Course Project — CS3.301</title>
</svelte:head>

<div class="page-header">
  <h1>Course Project</h1>
  <p>A semester-long project bringing together OS and networking concepts.</p>
</div>

<div class="sections">
  <section class="project-section">
    <h2 class="section-title">Overview</h2>
    <div class="content-placeholder">
      <p class="placeholder-text">Project overview will appear here.</p>
    </div>
  </section>

  <section class="project-section">
    <h2 class="section-title">Timeline & Milestones</h2>
    <div class="milestone-list">
      {#each milestones as ev}
        <div class="milestone-row">
          <span class="milestone-date">{fmtdate(ev.date)}</span>
          <span class="badge badge-{ev.type}">{typelabel[ev.type] ?? ev.type}</span>
          <span class="milestone-title">{ev.title}</span>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .sections {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 650;
    color: var(--text);
    margin-bottom: 16px;
  }

  .content-placeholder {
    min-height: 160px;
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

  .milestone-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }

  .milestone-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
  }

  .milestone-row:last-child {
    border-bottom: none;
  }

  .milestone-date {
    font-size: 12.5px;
    color: var(--text-3);
    font-family: var(--font-mono);
    min-width: 90px;
  }

  .milestone-title {
    font-size: 14px;
    color: var(--text);
    flex: 1;
  }
</style>
