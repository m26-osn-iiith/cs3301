<script>
  import staff from '$lib/data/staff.json';
  import Mail from 'lucide-svelte/icons/mail';
  import Clock from 'lucide-svelte/icons/clock';
  import MapPin from 'lucide-svelte/icons/map-pin';
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
      {#if s.image}
        <img src={s.image} alt={s.name} class="avatar photo" />
      {:else}
        <div class="avatar"></div>
      {/if}
      <div class="staff-info">
        <div class="staff-name">{s.name}</div>
        <div class="staff-role">{s.role}</div>
        {#if s.bio}
          <p class="staff-bio">{s.bio}</p>
        {/if}
        {#if s.email || s.time || s.location}
          <div class="staff-details">
            {#if s.email}
              <a href="mailto:{s.email}" class="staff-detail-row staff-email">
                <Mail size={11} strokeWidth={2} class="detail-icon" />
                <span class="detail-text">{s.email}</span>
              </a>
            {/if}
            {#if s.time}
              <div class="staff-detail-row">
                <Clock size={11} strokeWidth={2} class="detail-icon" />
                <span class="detail-text">{s.time}</span>
              </div>
            {/if}
            {#if s.location}
              <div class="staff-detail-row">
                <MapPin size={11} strokeWidth={2} class="detail-icon" />
                <span class="detail-text">{s.location}</span>
              </div>
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
    aspect-ratio: 3 / 3;
    flex-shrink: 0;
    display: block;
  }

  .avatar:not(.photo) {
    background: repeating-linear-gradient(
      45deg,
      var(--placeholder-1) 0,
      var(--placeholder-1) 6px,
      var(--placeholder-2) 6px,
      var(--placeholder-2) 12px
    );
  }

  .photo {
    object-fit: cover;
    object-position: center center;
  }

  .staff-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px 16px;
    min-width: 0;
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
    gap: 4px;
    margin-top: 2px;
  }

  .staff-detail-row {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 12px;
    text-decoration: none;
    min-width: 0;
  }

  .staff-email {
    color: var(--link);
  }

  .staff-email:hover {
    color: var(--link-hover);
  }

  .detail-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  :global(.detail-icon) {
    flex-shrink: 0;
  }
</style>
