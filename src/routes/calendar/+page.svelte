<script>
  import events from '$lib/data/calendar.json';

  const typelabel = { lecture: 'Lecture', tutorial: 'Tutorial', deadline: 'Deadline', exam: 'Exam', milestone: 'Milestone', holiday: 'Holiday' };

  function fmtdate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function monthof(d) {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  const bymonth = events.reduce((acc, ev) => {
    const m = monthof(ev.date);
    if (!acc[m]) acc[m] = [];
    acc[m].push(ev);
    return acc;
  }, {});
</script>

<svelte:head>
  <title>Calendar — CS3.301</title>
</svelte:head>

<div class="page-header">
  <h1>Calendar</h1>
  <p>All lectures, tutorials, assignments, and exams for Fall 2026.</p>
</div>

<div class="months">
  {#each Object.entries(bymonth) as [month, evs]}
    <section class="month-section">
      <h2 class="month-label">{month}</h2>
      <div class="event-list">
        {#each evs as ev}
          <div class="event-row">
            <span class="event-date">{fmtdate(ev.date)}</span>
            <span class="badge badge-{ev.type}">{typelabel[ev.type] ?? ev.type}</span>
            {#if ev.route}
              <a href={ev.route} class="event-title">{ev.title}</a>
            {:else}
              <span class="event-title plain">{ev.title}</span>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .months {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .month-label {
    font-size: 11.5px;
    font-weight: 650;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-4);
    margin-bottom: 12px;
  }

  .event-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }

  .event-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
  }

  .event-row:last-child {
    border-bottom: none;
  }

  .event-row:hover {
    background: var(--hover-bg);
  }

  .event-date {
    font-size: 12.5px;
    color: var(--text-3);
    font-weight: 500;
    min-width: 100px;
    font-family: var(--font-mono);
  }

  .event-title {
    font-size: 14px;
    color: var(--text);
    text-decoration: none;
    flex: 1;
  }

  .event-title:hover {
    color: var(--link);
  }

  .event-title.plain {
    color: var(--text-2);
  }
</style>
