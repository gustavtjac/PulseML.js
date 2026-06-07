<script>
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import { fetchGet } from "../../util/fetchUtil";
    import { navigate } from "svelte-routing";
    import { BASE_URL } from "../../stores/generalStore.js";
    import io from "socket.io-client";

    import LeaderboardBanner from "../../components/LeaderboardBanner/LeaderboardBanner.svelte";
    import Navbar from "../../components/Nav/Navbar.svelte";
    import PodiumCard from "../../components/PodiumCard/PodiumCard.svelte";

    let socket = $state();
    let games = $state([]);
    let selectedGame = $state();
    let gameLeaderBoardMap = $state({});
    let errorMessage = $state(null);
    let countries = $state([]);
    let selectedCountry = $state()

    onMount(async () => {
        try {
            const gamesResult = await fetchGet(`/api/games`);
            games = gamesResult.data.games;
            selectedGame = games[0]?.id;

            const result = await fetchGet("/api/countries");
            countries = result.data.countries;

            await loadLeaderboards();
        } catch (error) {
            toast(error?.data?.errorMessage ?? "Failed to load leaderboard");
        }

        socket = io($BASE_URL, {
            withCredentials: true,
        });

        socket.on("server-sends-leaderboards", (data) => {
            if (selectedCountry) {
                return;
            }
            gameLeaderBoardMap = data.data;
        });
    });

    async function loadLeaderboards(countryId) {
        await Promise.all(
            games.map(async (game) => {
                const url = countryId
                    ? `/api/leaderboard/${game.id}/${countryId}`
                    : `/api/leaderboard/${game.id}`;
                const leaderboard = await fetchGet(url);
                gameLeaderBoardMap[game.id] = leaderboard.data;
            }),
        );
    }

    async function handleCountryChange(){
        try {
            await loadLeaderboards(selectedCountry?.id);
        } catch (error) {
            toast(error?.data?.errorMessage ?? "Failed to load leaderboard");
        }
    }

</script>

<svelte:head>
    <title>PulseML.js - Leaderboard</title>
</svelte:head>
<LeaderboardBanner />
<Navbar />

<div class="header-row">
    <h1>Game Leaderboard</h1>
    <select bind:value={selectedGame}>
        {#each games as game (game.id)}
            <option value={game.id}>{game.name}</option>
        {/each}
    </select>

    <div class="country-selector">
{#if selectedCountry}
                <img class="country-flag-image"
                    src="https://flagcdn.com/{selectedCountry?.code.toLowerCase()}.svg"
                    width="24"
                    alt={selectedCountry?.name}
                />
            {/if}

<select bind:value={selectedCountry} onchange={handleCountryChange}>
        <option value={undefined}>Country not selected</option>
        {#each countries as country (country.id)}

            <option value={country}>{country.name}
                
            </option>
        {/each}
    </select>

    </div>

    
</div>

<main>
    {#if errorMessage}
        <h2>{errorMessage}</h2>
    {/if}

    {#if selectedGame && gameLeaderBoardMap[selectedGame]}
        {@const scores = gameLeaderBoardMap[selectedGame].highscores}
        {#if scores.length <= 0}
            <h1>No leaderboard data</h1>
        {/if}
        <div class="podium-wrapper">
            {#each scores.slice(0, 3) as score, i (score.username)}
                <PodiumCard rank={i + 1} {score} />
            {/each}
        </div>

        <div class="highscore-table">
            {#each scores.slice(3) as score, i (score.username)}
                <div class="highscore-row">
                    <span class="rank">#{i + 4}</span>

                    <button
                        class="profile-link"
                        onclick={() => navigate(`/profile/${score.username}`)}
                    >
                        <img src={score.profile_picture} alt={score.username} />
                        <span class="username">@{score.username}</span>
                    </button>
                    {#if score.country_code}
                        <div class="country-badge">
                            <img
                                src="https://flagcdn.com/{score.country_code.toLowerCase()}.svg"
                                alt={score.country_name}
                            />
                            <span>{score.country_name}</span>
                        </div>
                    {/if}
                    <span class="score">{score.score} pts</span>
                    <span class="date">{score.date}</span>
                </div>
            {/each}
        </div>
    {/if}
</main>

<style>
    .header-row {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    select {
        width: 20vw;
    }
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    .podium-wrapper {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
    }
    .highscore-table {
        display: flex;
        flex-direction: column;
        width: 80vw;
        border: 1px solid var(--border);
        border-radius: 12px;
        overflow: hidden;
    }

    .highscore-row {
        display: flex;
        align-items: center;
        flex-direction: row;
        width: 100%;
        padding: 0.8rem 1.5rem;
        gap: 1rem;
        border-bottom: 1px solid var(--border);
        box-sizing: border-box;
        background: var(--bg-surface);
        transition: background 0.15s;
    }

    .highscore-row:last-child {
        border-bottom: none;
    }

    .highscore-row:hover {
        background: var(--bg-raised);
    }

    .rank {
        font-size: 0.85rem;
        color: var(--text-muted);
        width: 2rem;
        flex-shrink: 0;
    }

    .profile-link {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
        background: none;
        border: none;
        border-radius: 0;
        padding: 0;
        cursor: pointer;
        font: inherit;
        text-align: left;
        color: inherit;
        text-transform: none;
        letter-spacing: normal;
        transition: none;
    }
    .country-selector {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1vw;
    }
    .username {
        font-weight: 600;
        color: var(--text);
    }

    .score {
        color: var(--accent);
        font-weight: 700;
    }

    .date {
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
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
    }

    .country-flag-image {
        width: 2vw;
        height: auto;
        border-radius: 2px;
    }
    .country-badge img {
        width: 18px;
        height: auto;
        border-radius: 2px;
    }
</style>
