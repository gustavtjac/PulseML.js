<script>
    import LeaderboardBanner from "../../components/LeaderboardBanner/LeaderboardBanner.svelte";
    import Navbar from "../../components/Nav/Navbar.svelte";
    import PublicProfileCard from "../../components/PublicProfileCard/PublicProfileCard.svelte";
    import PublicProfileStats from "../../components/PublicProfileStats/PublicProfileStats.svelte";
    import ProfileStreak from "../../components/ProfileStreak/ProfileStreak.svelte";

    import { fetchGet } from "../../util/fetchUtil.js";
    import { onMount } from "svelte";

    let { username } = $props();
    let profile = $state(null);
    let scores = $state([]);
    let errorMessage = $state(null);

    onMount(async () => {
        try {
            const profileResult = await fetchGet(`/api/users/${username}`);
            const scoresResult = await fetchGet(
                `/api/scores/users/${username}`,
            );

            profile = profileResult.data.profile;
            scores = scoresResult.data.scores;
        } catch (error) {
            errorMessage =
                error?.data?.errorMessage ?? "Failed to load profile.";
        }
    });
</script>

<svelte:head>
    <title>PulseML.js - {username}</title>
</svelte:head>

<LeaderboardBanner />
<Navbar />

<div class="page">
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else if profile}
        <div class="cards-row">
            <PublicProfileCard {profile} />
            <div class="center">
                <PublicProfileStats {scores} />
                <ProfileStreak
                    playStreak={profile.streak}
                    publicProfile={true}
                />
            </div>
        </div>
    {:else}
        <p class="loading">Loading...</p>
    {/if}
</div>

<style>
    .center {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .page {
        display: flex;
        justify-content: center;
        padding: 2rem;
    }

    .cards-row {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
    }

    .error,
    .loading {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin-top: 4rem;
    }

    .error {
        color: var(--error, #e55);
    }
</style>
