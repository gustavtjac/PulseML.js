<script>
    import { onMount } from "svelte";
    import LeaderboardBanner from "../../components/LeaderboardBanner/LeaderboardBanner.svelte";
    import Navbar from "../../components/Nav/Navbar.svelte";
    import PublicProfileCard from "../../components/PublicProfileCard/PublicProfileCard.svelte";
    import PublicProfileStats from "../../components/PublicProfileStats/PublicProfileStats.svelte";
    import { fetchGet } from "../../util/fetchUtil.js";

    let { username } = $props();

    let profile = $state(null);
    let scores = $state([]);
    let error = $state(null);

    onMount(async () => {
        try {
            const [profileRes, scoresRes] = await Promise.all([
                fetchGet(`/api/users/profile/${username}`),
                fetchGet(`/api/scores/user/${username}`),
            ]);
            profile = profileRes.data.profile;
            scores = scoresRes.data.scores;
        } catch (err) {
            error = err?.data?.errorMessage ?? "Failed to load profile.";
        }
    });
</script>

<LeaderboardBanner />
<Navbar />

<div class="page">
    {#if error}
        <p class="error">{error}</p>
    {:else if profile}
        <div class="cards-row">
            <PublicProfileCard {profile} />
            <PublicProfileStats {scores} />
        </div>
    {:else}
        <p class="loading">Loading...</p>
    {/if}
</div>

<style>
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

    .error, .loading {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin-top: 4rem;
    }

    .error {
        color: var(--error, #e55);
    }

    @media (max-width: 768px) {
        .cards-row {
            flex-direction: column;
        }
    }
</style>
