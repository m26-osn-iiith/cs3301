<script>
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import ChevronRight from 'lucide-svelte/icons/chevron-right';
  import Sun from 'lucide-svelte/icons/sun';
  import Moon from 'lucide-svelte/icons/moon';
  import { course } from '$lib/data/course.js';

  let { onclose = () => {} } = $props();

  const nav = [
    { type: 'item', label: 'Home', href: '/' },
    { type: 'item', label: 'Calendar', href: '/calendar' },
    { type: 'spacer' },
    {
      type: 'group', label: 'Lectures', href: '/lectures', items: [
        { label: '1. Introduction to OS & Networks', href: '/lectures/intro-os-networks' },
        { label: '2. Processes, Threads & Concurrency', href: '/lectures/processes-threads' },
        { label: '3. CPU Scheduling', href: '/lectures/cpu-scheduling' },
        { label: '4. Networking Fundamentals', href: '/lectures/networking-fundamentals' },
      ]
    },
    {
      type: 'group', label: 'Assignments', href: '/assignments', items: [
        { label: '1. Shell Implementation', href: '/assignments/shell' },
        { label: '2. Producer–Consumer', href: '/assignments/producer-consumer' },
        { label: '3. TCP Chat Server', href: '/assignments/chat-server' },
      ]
    },
    {
      type: 'group', label: 'Tutorials', href: '/tutorials', items: [
        { label: '1. Dev Environment Setup', href: '/tutorials/dev-environment' },
        { label: '2. pthreads & Synchronization', href: '/tutorials/pthreads' },
        { label: '3. Socket Programming Basics', href: '/tutorials/sockets' },
      ]
    },
    { type: 'spacer' },
    { type: 'item', label: 'Course Project', href: '/project' },
    { type: 'spacer' },
    {
      type: 'group', label: 'Resources', href: '/resources', items: [
        { label: 'Textbooks & Readings', href: '/resources/textbooks' },
        { label: 'Reference Docs & Man Pages', href: '/resources/reference' },
        { label: 'Tools & Setup', href: '/resources/tools' },
      ]
    },
    { type: 'item', label: 'Course Policy', href: '/policy' },
    { type: 'item', label: 'Staff', href: '/staff' },
  ];

  let opengroup = $state('');
  let theme = $state('dark');

  onMount(() => {
    theme = document.documentElement.getAttribute('data-theme') || 'dark';
  });

  $effect(() => {
    const path = page.url.pathname;
    for (const entry of nav) {
      if (entry.type === 'group' && entry.items.some(i => path === i.href || path.startsWith(i.href + '/'))) {
        opengroup = entry.label;
        return;
      }
    }
  });

  function togglegroup(e, entry) {
    e.preventDefault();
    const wasopen = opengroup === entry.label;
    opengroup = wasopen ? '' : entry.label;
    if (page.url.pathname !== entry.href) goto(entry.href);
    else onclose();
  }

  function toggletheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('cs3301-theme', theme); } catch (_) {}
  }

  function isactive(href) {
    if (href === '/') return page.url.pathname === '/';
    return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
  }

  function isgroupactive(entry) {
    return page.url.pathname === entry.href || entry.items.some(i => page.url.pathname === i.href || page.url.pathname.startsWith(i.href + '/'));
  }
</script>

<a href="/" class="course-link" onclick={onclose}>
  <div class="course-code">{course.code}</div>
  <div class="course-name">{course.name}</div>
</a>

<nav class="nav">
  {#each nav as entry}
    {#if entry.type === 'spacer'}
      <div class="spacer"></div>
    {:else if entry.type === 'item'}
      <a
        href={entry.href}
        class="nav-item {isactive(entry.href) ? 'active' : ''}"
        onclick={onclose}
      >{entry.label}</a>
    {:else if entry.type === 'group'}
      {@const open = opengroup === entry.label}
      {@const active = isgroupactive(entry)}
      <a
        href={entry.href}
        class="nav-item group-header {active ? 'active' : ''}"
        onclick={(e) => togglegroup(e, entry)}
        aria-expanded={open}
      >
        <span>{entry.label}</span>
        <span class="chevron" class:open>{@html '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>'}</span>
      </a>
      <div
        class="group-items"
        style="max-height:{open ? entry.items.length * 36 + 6 : 0}px;opacity:{open ? 1 : 0};margin-top:{open ? 2 : 0}px"
      >
        {#each entry.items as item}
          <a
            href={item.href}
            class="nav-item nav-subitem {isactive(item.href) ? 'active' : ''}"
            onclick={onclose}
          >{item.label}</a>
        {/each}
      </div>
    {/if}
  {/each}
</nav>

<div class="footer">
  <button class="theme-toggle" onclick={toggletheme}>
    {#if theme === 'dark'}
      <Sun size={16} strokeWidth={2} />
      <span>Light mode</span>
    {:else}
      <Moon size={16} strokeWidth={2} />
      <span>Dark mode</span>
    {/if}
  </button>
</div>

<style>
  .course-link {
    display: block;
    margin: 0 4px 22px;
    text-decoration: none;
  }

  .course-code {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  .course-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    margin-top: 2px;
    line-height: 1.3;
  }

  .nav {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
  }

  .spacer {
    height: 6px;
  }

  .nav-item {
    display: block;
    padding: 8px 10px;
    border-radius: 7px;
    font-size: 14px;
    font-weight: 450;
    color: var(--text-2);
    text-decoration: none;
    transition: background 0.1s, color 0.1s;
  }

  .nav-item:hover {
    background: var(--hover-bg);
    color: var(--text);
  }

  .nav-item.active {
    font-weight: 600;
    color: var(--text);
    background: var(--border);
  }

  .group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .chevron {
    display: flex;
    flex: none;
    color: var(--text-3);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .chevron.open {
    transform: rotate(90deg);
  }

  .group-items {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
    transition: max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease, margin-top 0.28s ease;
  }

  .nav-subitem {
    padding: 7px 10px;
    margin-left: 16px;
    font-size: 13.5px;
  }

  .footer {
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }

  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    width: 100%;
    cursor: pointer;
    color: var(--text-2);
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    transition: border-color 0.12s;
  }

  .theme-toggle:hover {
    border-color: var(--border-strong);
  }
</style>
