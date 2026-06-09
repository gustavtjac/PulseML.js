<script>
    import { navigate } from "svelte-routing";
    let { rank, score } = $props();

    const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
</script>

<div class="podium-card rank-{rank}">
    <button
        class="profile-link"
        onclick={() => navigate(`/profile/${score.username}`)}
    >
        <img src={score.profile_picture} alt={score.username} />
        <span class="username">@{score.username}</span>
    </button>
    <span class="medal">{medals[rank]}</span>
    {#if score.country_code}
        <div class="country-badge">
            <img
                src="https://flagcdn.com/{score.country_code.toLowerCase()}.svg"
                alt={score.country_name}
            />
            <span>{score.country_name}</span>
        </div>
    {/if}
    <span class="pts">{score.score} pts</span>
    <span class="date">{score.date}</span>
</div>

<style>
    .podium-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        padding: 1.5rem 2rem;
        border-radius: 16px;
        border: 1px solid var(--border);
        background: var(--bg-surface);
        width: 220px;
    }

    .rank-1 {
        order: 2;
        padding-top: 2.5rem;
        background: linear-gradient(160deg, var(--bg-surface), #3d2e0022);
        border-color: gold;
        box-shadow: 0 0 18px 2px #ffd70033;
    }

    .rank-2 {
        order: 1;
        align-self: flex-end;
        background: linear-gradient(160deg, var(--bg-surface), #c0c0c022);
        border-color: silver;
    }

    .rank-3 {
        order: 3;
        align-self: flex-end;
        background: linear-gradient(160deg, var(--bg-surface), #cd7f3222);
        border-color: #cd7f32;
    }

    .profile-link {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        background: none;
        border: none;
        border-radius: 0;
        padding: 0;
        cursor: pointer;
        font: inherit;
        color: inherit;
        text-transform: none;
        letter-spacing: normal;
        transition: none;
    }

    img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        object-fit: cover;
    }

    .medal {
        font-size: 2rem;
        line-height: 1;
    }

    .username {
        font-weight: 700;
        color: var(--text);
        font-size: 0.95rem;
    }

    .country-badge {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        background: var(--bg-raised);
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 0.2rem 0.7rem;
        font-size: 0.8rem;
        color: var(--text-muted);
        max-width: 100%;
        overflow: hidden;
    }

    .country-badge img {
        width: 18px;
        height: auto;
        border-radius: 2px;
        flex-shrink: 0;
    }

    .country-badge span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .pts {
        color: var(--accent);
        font-weight: 700;
        font-size: 0.9rem;
    }

    .date {
        font-size: 0.75rem;
        color: var(--text-muted);
    }
</style>
