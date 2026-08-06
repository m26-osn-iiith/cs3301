<script>
  import staff from '$lib/data/staff.json';
</script>

<svelte:head>
  <title>Staff — CS3.301</title>
</svelte:head>

<div class="page-header">
  <h1>Staff</h1>
  <p>Instructors and teaching assistants for CS3.301.</p>
</div>

<div class="staff-grid">
  {#each staff as s}
    <div class="card staff-card">
      <div class="photo-placeholder"></div>
      <div class="staff-info">
        <div class="staff-name">{s.name}</div>
        <div class="staff-role">{s.role}</div>
        <p class="staff-bio">{s.bio}</p>
        <div class="staff-details">
          <a href="mailto:{s.email}" class="staff-email">{s.email}</a>
          <div class="staff-hours">{s.hours}</div>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .staff-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }

  .staff-card {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .photo-placeholder {
    aspect-ratio: 1 / 1;
    border-radius: 8px;
    background: repeating-linear-gradient(
      45deg,
      var(--placeholder-1) 0,
      var(--placeholder-1) 5px,
      var(--placeholder-2) 5px,
      var(--placeholder-2) 10px
    );
  }

  .staff-name {
    font-size: 15px;
    font-weight: 650;
    color: var(--text);
  }

  .staff-role {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-top: -6px;
  }

  .staff-bio {
    font-size: 13.5px;
    color: var(--text-2);
    line-height: 1.6;
  }

  .staff-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
  }

  .staff-email {
    color: var(--link);
    text-decoration: none;
  }

  .staff-email:hover {
    color: var(--link-hover);
  }

  .staff-hours {
    color: var(--text-3);
    font-family: var(--font-mono);
    font-size: 12.5px;
  }
</style>
