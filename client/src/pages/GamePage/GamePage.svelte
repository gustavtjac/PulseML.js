<script>
    import Navbar from "../../components/Nav/Navbar.svelte";
    import LeaderboardBanner from "../../components/LeaderboardBanner/LeaderboardBanner.svelte";

    let { gameId } = $props()
</script>

<LeaderboardBanner/>
<Navbar/>

