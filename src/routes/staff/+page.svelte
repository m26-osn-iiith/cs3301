<script>
  import staff from '$lib/data/staff.json';
</script>

<svelte:head>
  <title>Staff — CS3.301</title>
</svelte:head>

<div class="page-header">
  <h1>Staff</h1>
  <p>Monsoon 2026</p>
</div>

<div class="staff-grid">
  {#each staff as s}
    <div class="card staff-card">
      <div class="avatar"></div>
      <div class="staff-info">
        <div class="staff-name">{s.name}</div>
        <div class="staff-role">{s.role}</div>
        {#if s.bio}
          <p class="staff-bio">{s.bio}</p>
        {/if}
        {#if s.email || s.hours}
          <div class="staff-details">
            {#if s.email}
              <a href="mailto:{s.email}" class="staff-email">{s.email}</a>
            {/if}
            {#if s.hours}
              <div class="staff-hours">{s.hours}</div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .staff-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
  }

  .staff-card {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
    overflow: hidden;
  }

  .avatar {
    width: 100%;
    aspect-ratio: 4 / 3;
    background: repeating-linear-gradient(
      45deg,
      var(--placeholder-1) 0,
      var(--placeholder-1) 6px,
      var(--placeholder-2) 6px,
      var(--placeholder-2) 12px
    );
    flex-shrink: 0;
  }

  .staff-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px 16px;
  }

  .staff-name {
    font-size: 14px;
    font-weight: 650;
    color: var(--text);
  }

  .staff-role {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-top: -2px;
  }

  .staff-bio {
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.55;
    margin-top: 2px;
  }

  .staff-details {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-top: 2px;
  }

  .staff-email {
    font-size: 12.5px;
    color: var(--link);
    text-decoration: none;
  }

  .staff-email:hover {
    color: var(--link-hover);
  }

  .staff-hours {
    font-size: 12px;
    color: var(--text-3);
    font-family: var(--font-mono);
  }
</style>
