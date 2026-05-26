<script>
  let { title, description, icon, onclick } = $props();
</script>

<button class="card"  {onclick}>
  <div class="accent-bar"></div>
  <div class="card-body">
    <div class="icon">{icon}</div>
    <div class="info">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <div class="arrow">
        ›
    </div>
  </div>
</button>

<style>
  .card {
    all: unset;
    display: block;
    width: 100%;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }

  .card:hover:not(:disabled) {
    border-color: var(--card-accent);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px color-mix(in srgb, var(--card-accent) 15%, transparent);
  }

  .card:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .accent-bar {
    height: 3px;
    background: var(--card-accent);
  }

  .card-body {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    padding: 1.8rem 2rem;
  }

  .icon {
    font-size: 2.4rem;
    line-height: 1;
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    min-width: 0;
  }

  .info h3 {
    margin: 0 0 0.3rem;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text);
  }

  .info p {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .arrow {
    font-size: 1.8rem;
    color: var(--card-accent);
    flex-shrink: 0;
    transition: transform 0.15s;
  }

</style>
