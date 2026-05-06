<script>
import LeaderboardBanner from "../../components/LeadearboardBanner/LeaderboardBanner.svelte";
import Navbar from "../../components/Nav/Navbar.svelte";

let { username } = $props();      

</script>

<LeaderboardBanner/>
<Navbar/>


<h2>PUBLIC {username}</h2>