<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import Navbar from "../../components/Nav/Navbar.svelte";
    import LeaderboardBanner from "../../components/LeaderboardBanner/LeaderboardBanner.svelte";
    import GameCard from "../../components/GameCard/GameCard.svelte";
    import { fetchGet } from "../../util/fetchUtil.js";

    const icons = { 1: "💪", 2: "🏋️‍♂️" };

    let games = $state([]);

    onMount(async () => {
        const result = await fetchGet("/api/games");
        games = result.data.games;
    });

    function handleGameCardClick(gameId) {
        navigate(`/games/${gameId}`);
    }
</script>
<svelte:head>
    <title>PulseML.js - Home </title>
</svelte:head>
<LeaderboardBanner />
<Navbar />

<main>
    <h1>Choose a game!</h1>

    <div class="gameswrapper">
        {#each games as game (game.id)}
            <GameCard
                title={game.name}
                description={game.description}
                icon={icons[game.id] ?? "🎮"}
                onclick={() => handleGameCardClick(game.id)}
            />
        {/each}
    </div>
</main>

<style>
    .gameswrapper {
        display: flex;
        align-items: center;
        flex-direction: row;
        padding: 50px;
        gap: 2vw;
    }

    h1 {
        margin-top: 5vh;
        text-align: center;
    }
</style>
