<script>
    import { authReady, user } from "../../stores/userStore.js";
    import { navigate } from "svelte-routing";

    let { requireAuth = false, children } = $props();

    $effect(() => {
        if ($authReady) {
            if (requireAuth && $user === null) navigate("/login");
            else if (!requireAuth && $user) navigate("/dashboard");
        }
    });
</script>

{#if $authReady && ((requireAuth && $user) || (!requireAuth && !$user))}
    {@render children()}
{/if}
