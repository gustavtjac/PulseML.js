<script>
    import { onMount } from "svelte";
    import { user } from "../../stores/userStore.js";
    import { fetchGet } from "../../util/fetchUtil.js";
    import { toast } from "svelte-sonner";

    import Navbar from "../../components/Nav/Navbar.svelte";
    import ProfileCard from "../../components/ProfileCard/ProfileCard.svelte";
    import ResetPassword from "../../components/ChangePassword/ChangePassword.svelte";
    import LeaderboardBanner from "../../components/LeaderboardBanner/LeaderboardBanner.svelte";
    import PublicProfileStats from "../../components/PublicProfileStats/PublicProfileStats.svelte";
    import ProfileStreak from "../../components/ProfileStreak/ProfileStreak.svelte";
    import DeleteAccount from "../../components/DeleteAccount/DeleteAccount.svelte";

    let scores = $state([]);
    let profile = $state(null);
    let errorMessage = $state("");

    onMount(async () => {
        try {
            const [scoresResult, profileResult] = await Promise.all([
                fetchGet(`/api/scores/users/${$user.username}`),
                fetchGet(`/api/users/${$user.username}`),
            ]);
            scores = scoresResult.data.scores;
            profile = profileResult.data.profile;
        } catch (error) {
            errorMessage =
                error?.data?.errorMessage ?? "Failed to load users scores";
            toast.error(errorMessage);
        }
    });
</script>

<svelte:head>
    <title>PulseML.js - {$user.username}</title>
</svelte:head>
<LeaderboardBanner />
<Navbar></Navbar>
<div class="cards-row">
    <ProfileCard />
    <div class="right-col">
        <PublicProfileStats {scores} />
        <ResetPassword />
    </div>
    <div class="right-col">
        <ProfileStreak playStreak={profile?.streak ?? 0} />
        <DeleteAccount />
    </div>
</div>

<style>
    .cards-row {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 2rem;
        gap: 2rem;
    }

    .right-col {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
</style>
