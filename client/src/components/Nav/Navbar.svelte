<script>
  import { Router, Link, navigate } from "svelte-routing";
  import { user } from "../../stores/userStore.js";
  import { fetchPost } from "../../util/fetchUtil.js";
  import { toast } from "svelte-sonner";

  async function logout() {
    try {
      const result = await fetchPost("/auth/logout");
      user.set(null);
      toast.success(result.data.successMessage);
      navigate("/");
    } catch (error) {
      toast.success(error.data.errorMessage);
    }
  };

</script>

<Router>
  <nav>
    <Link to="/" class="logo">
      <img src="/favicon.svg" width="28" height="28" alt="PulseML logo" />
      <h2>PulseML.js</h2>
    </Link>
    <div class="links">
      {#if $user}
        <Link to="/dashboard">Home</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/profile" class="profile-link">
          <img src={$user?.profile_picture} alt="Profile" class="profile-avatar" />
        </Link>
        <button onclick={logout}>Logout</button>
      {:else}
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      {/if}
    </div>
  </nav>
</Router>

<style>
  nav {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 2rem 2rem;
    background: rgba(10, 14, 23, 0.85);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }

  :global(.logo) {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    border-bottom: none;
    margin-right: auto;
  }

  :global(.logo h2) {
    margin: 0;
    font-size: 1.2rem;
    color: var(--accent);
  }

  :global(.logo:hover) {
    opacity: 0.8;
  }

  .links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  :global(.profile-link) {
    border-bottom: none;
    display: flex;
    align-items: center;
  }

  .profile-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--border);
    transition: border-color 0.15s;
  }

  .profile-avatar:hover {
    border-color: var(--accent);
  }
</style>
