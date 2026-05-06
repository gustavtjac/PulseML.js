<script>
  import Navbar from "../../components/Nav/Navbar.svelte";
  import Login from "../../components/Login/Login.svelte";
  import Register from "../../components/Register/Register.svelte";
  import LeaderboardBanner from "../../components/LeadearboardBanner/LeaderboardBanner.svelte";
  import { user } from "../../stores/userStore.js";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";


  let { view = $bindable() } = $props();

  onMount(() => {
    if ($user) {
      navigate("/dashboard");
    }
  });
</script>
  <LeaderboardBanner/>
  <Navbar />
  <main aria-label="Authentication">
    {#if view === "login"}
      <Login />
      <footer>
        <p>
          Don't have an account? <button
            type="button"
            onclick={() => navigate("/register")}>Create one</button>
        </p>
      </footer>
    {:else}
      <Register/>
      <footer>
        <p>
          Already have an account? <button
            type="button"
            onclick={() => navigate("/login")}>Sign in</button>
        </p>
      </footer>
    {/if}
  </main>

<style>
  footer {
    margin: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
