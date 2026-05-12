<script>
    let { scores } = $props();
</script>

<main>
    <h2>Game Stats</h2>
    {#if scores.length === 0}
        <p class="empty">No games played yet.</p>
    {:else}
        <table>
            <thead>
                <tr>
                    <th>Game</th>
                    <th>Best Score</th>
                    <th>Plays</th>
                </tr>
            </thead>
            <tbody>
                {#each scores as row}
                    <tr>
                        <td>{row.game_name}</td>
                        <td class="highlight">{row.best_score}</td>
                        <td class="muted">{row.plays}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</main>

<style>
    main {
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 2rem;
        color: var(--text);
        min-width: 340px;
    }

    h2 {
        margin: 0 0 1.5rem;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: -0.01em;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead th {
        font-size: 0.7rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-muted);
        text-align: left;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--border);
    }

    tbody tr {
        border-bottom: 1px solid var(--border);
    }

    tbody tr:last-child {
        border-bottom: none;
    }

    tbody td {
        padding: 0.85rem 0;
        font-size: 0.9rem;
    }

    .highlight {
        color: var(--accent);
        font-weight: 700;
    }

    .muted {
        color: var(--text-muted);
    }

    .empty {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin: 0;
    }
</style>
