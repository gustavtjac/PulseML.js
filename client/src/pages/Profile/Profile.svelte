<script>
import { onMount } from "svelte";
import Navbar from "../../components/Nav/Navbar.svelte";
import ProfileCard from "../../components/ProfileCard/ProfileCard.svelte";
import ResetPassword from "../../components/ResetPassword/ResetPassword.svelte";
import LeaderboardBanner from "../../components/LeaderboardBanner/LeaderboardBanner.svelte";
import PublicProfileStats from "../../components/PublicProfileStats/PublicProfileStats.svelte";
import { user } from "../../stores/userStore.js";
import { fetchGet } from "../../util/fetchUtil.js";

let scores = $state([]);

onMount(async () => {
    try {
        const result = await fetchGet(`/api/scores/user/${$user.username}`);
        scores = result.data.scores;
    } catch (e) {}
});
</script>

<LeaderboardBanner/>
<Navbar></Navbar>
<div class="cards-row">
    <ProfileCard/>
    <div class="right-col">
        <PublicProfileStats {scores}/>
        <ResetPassword/>
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
