<script>
  import course from '$lib/data/course.json';
  import events from '$lib/data/calendar.json';

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(e => e.date >= today && e.type !== 'holiday').slice(0, 3);

  const sections = [
    { label: 'Calendar', href: '/calendar', desc: 'Schedule & deadlines' },
    { label: 'Lectures', href: '/lectures', desc: 'Slides & readings' },
    { label: 'Mini-Projects', href: '/assignments', desc: 'Hands-on projects' },
    { label: 'Tutorials', href: '/tutorials', desc: 'Walkthroughs & setup' },
    { label: 'Course Project', href: '/project', desc: 'TBA' },
    { label: 'Resources', href: '/resources', desc: 'Texts, docs & tools' },
    { label: 'Course Policy', href: '/policy', desc: 'Grading & rules' },
    { label: 'Staff', href: '/staff', desc: 'Instructor & TAs' },
  ];

  function fmtdate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
</script>

<svelte:head>
  <title>{course.code} — {course.name}</title>
</svelte:head>

<header class="hero">
  <div class="hero-meta">{course.code} · {course.term}</div>
  <h1 class="hero-title">{course.name}</h1>
  <p class="hero-tagline">{course.tagline}</p>
</header>

<div class="sections-grid">
  {#each sections as s}
    <a href={s.href} class="card">
      <div class="card-title">{s.label}</div>
      <div class="card-desc">{s.desc}</div>
    </a>
  {/each}
</div>

{#if upcoming.length > 0}
  <section class="upnext" style="margin-top:52px">
    <h2 class="upnext-title">Up next</h2>
    <div class="event-list">
      {#each upcoming as ev}
        <svelte:element
          this={ev.route ? 'a' : 'div'}
          href={ev.route ?? undefined}
          class="event-row"
        >
          <span class="badge badge-{ev.type}">{ev.type[0].toUpperCase() + ev.type.slice(1)}</span>
          <span class="event-name">{ev.title}</span>
          <span class="event-date">{fmtdate(ev.date)}</span>
        </svelte:element>
      {/each}
    </div>
  </section>
{/if}

<style>
  .hero-meta {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-3);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .hero-title {
    font-size: 38px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.01em;
    margin: 10px 0 14px;
  }

  .hero-tagline {
    font-size: 17px;
    color: var(--text-2);
    line-height: 1.6;
    max-width: 560px;
    margin: 0;
  }

  .sections-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 12px;
    margin-top: 40px;
  }

  .card {
    display: block;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--card-bg);
    padding: 16px 18px;
    text-decoration: none;
    transition: border-color 0.15s;
  }

  .card:hover {
    border-color: var(--border-strong);
  }

  .card-title {
    font-size: 14.5px;
    font-weight: 650;
    color: var(--text);
  }

  .card-desc {
    font-size: 13px;
    color: var(--text-2);
    margin-top: 4px;
    line-height: 1.4;
  }

  .upnext-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 14px;
  }

  .event-list {
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--card-bg);
    overflow: hidden;
  }

  .event-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
    color: inherit;
    transition: background 0.1s;
  }

  .event-row:last-child {
    border-bottom: none;
  }

  a.event-row:hover {
    background: var(--hover-bg);
  }

  .event-name {
    flex: 1;
    font-size: 14.5px;
    color: var(--text);
  }

  .event-date {
    font-size: 13px;
    color: var(--text-3);
    white-space: nowrap;
  }
</style>
