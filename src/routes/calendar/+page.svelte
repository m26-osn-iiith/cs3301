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

  function escapeIcs(value = '') {
    return String(value)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r?\n/g, '\\n');
  }

  function formatIcsDate(dateString) {
    return dateString.replace(/-/g, '');
  }

  function addDays(dateString, days) {
    const dt = new Date(`${dateString}T12:00:00Z`);
    dt.setUTCDate(dt.getUTCDate() + days);
    return dt.toISOString().slice(0, 10);
  }

  function downloadCalendar() {
    const dtStamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CS3301//Calendar Export//EN',
      'CALSCALE:GREGORIAN',
      ...events.flatMap((ev) => {
        const date = ev.date;
        const uid = `${date}-${(ev.title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/^-|-$/g, '');
        const summary = escapeIcs(ev.title);
        const category = escapeIcs(typelabel[ev.type] ?? ev.type);

        return [
          'BEGIN:VEVENT',
          `UID:${uid}@cs3301`,
          `DTSTAMP:${dtStamp}`,
          `DTSTART;VALUE=DATE:${formatIcsDate(date)}`,
          `DTEND;VALUE=DATE:${formatIcsDate(addDays(date, 1))}`,
          `SUMMARY:${summary}`,
          `CATEGORIES:${category}`,
          'END:VEVENT'
        ];
      }),
      'END:VCALENDAR'
    ];

    const ics = `${lines.join('\r\n')}\r\n`;
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'cs3301-calendar.ics';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
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
  <div>
    <h1>Calendar</h1>
    <p>Monsoon 2026</p>
  </div>
  <button type="button" class="export-button" on:click={downloadCalendar}>Export</button>
</div>

{#if events.length === 0}
  <div class="empty">No events yet.</div>
{:else}
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
{/if}

<style>
  .page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .export-button {
    appearance: none;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--bg-2);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 14px;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
  }

  .export-button:hover {
    background: var(--hover-bg);
    border-color: var(--link);
    transform: translateY(-1px);
  }

  .empty {
    border: 1.5px dashed var(--border);
    border-radius: 10px;
    padding: 48px 24px;
    text-align: center;
    color: var(--text-4);
    font-size: 14px;
  }

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
