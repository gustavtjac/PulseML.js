<script>
    import { onMount } from "svelte";
    import io from "socket.io-client";
    import { BASE_URL } from "../../stores/generalStore.js";
    let socket = $state();
    let leaderboardRankings = $state();

    onMount(() => {
        socket = io($BASE_URL, {
            withCredentials: true,
        });

        socket.on("server-sends-leaderboard-banner", (data) => {
            leaderboardRankings = data.data;
        });
    });
</script>

    <main class="carousel">
        <section class="group">
            <span class="label">⚡ LIVE LEADERBOARD</span>
            {#each leaderboardRankings as game, i (game.name)}
                <div class="card">
                    <span class="game-name">🎮 {game.name}</span>
                    {#each game.scores as score, j}
                        <span class="score">
                            <span class="rank">{j === 0 ? '🥇' : j === 1 ? '🥈' : '🥉'}</span>
                            <a href="/profile/{score.username}"><span class="username">@{score.username}</span></a>
                            <span class="pts">{score.score} pts</span>
                        </span>
                    {/each}
                </div>
            {/each}
            <span class="sep">✦</span>
        </section>
        <section aria-hidden="true" class="group">
            <span class="label">⚡ LIVE LEADERBOARD</span>
            {#each leaderboardRankings as game, i (game.name)}
                <div class="card">
                    <span class="game-name">🎮 {game.name}</span>
                    {#each game.scores as score, j}
                        <span class="score">
                            <span class="rank">{j === 0 ? '🥇' : j === 1 ? '🥈' : '🥉'}</span>
                            <a href="/profile/{score.username}"><span class="username">@{score.username}</span></a>
                            
                            <span class="pts">{score.score} pts</span>
                        </span>
                    {/each}
                </div>
            {/each}
            <span class="sep">✦</span>
        </section>
    </main>

<style>
    .carousel {
        height: 43px;
        width: 100vw;
        background-color: var(--accent-dim);
        border-bottom: 2px solid var(--accent);
        display: flex;
        flex-direction: row;
        overflow: hidden;
    }

    .group {
        width: 100vw;
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        align-items: center;
        gap: 0.5em;
        animation: spin 18s infinite linear;
    }

    .card {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.6em;
        flex-shrink: 0;
        padding: 0 1em;
        white-space: nowrap;
        border-right: 1px solid var(--border);
    }

    .label {
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--bg);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        padding: 0 1.5em;
        flex-shrink: 0;
        border-right: 2px solid rgba(0,0,0,0.2);
    }

    .game-name {
        font-size: 1rem;
        font-weight: 700;
        color: var(--bg);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-right: 0.4em;
    }

    .card {
        padding: 0 1.8em;
        gap: 0.8em;
    }

    .score {
        display: flex;
        align-items: center;
        gap: 0.4em;
        font-size: 1rem;
    }

    .rank {
        font-size: 1.1rem;
    }

    .username {
        color: var(--bg);
        font-weight: 700;
    }

    .pts {
        color: var(--bg);
        font-weight: 500;
        opacity: 0.7;
    }

    .sep {
        color: var(--bg);
        padding: 0 1em;
        flex-shrink: 0;
        opacity: 0.4;
        font-size: 1.2rem;
    }

    @keyframes spin {
        from { transform: translateX(0); }
        to { transform: translateX(-100%); }
    }
</style>
