<script>
    import Navbar from "../../components/Nav/Navbar.svelte";
    import Login from "../../components/Login/Login.svelte";
    import Register from "../../components/Register/Register.svelte";
    import ForgotPassword from "../../components/ForgotPassword/ForgotPassword.svelte";
    import LeaderboardBanner from "../../components/LeaderboardBanner/LeaderboardBanner.svelte";
    import ResetPassword from "../../components/ResetPassword/ResetPassword.svelte";
    import { user } from "../../stores/userStore.js";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";

    let { view = $bindable(), resetToken = $bindable()  } = $props();

    onMount(() => {
        if ($user) {
            navigate("/dashboard");
        }
    });
</script>

<LeaderboardBanner />
<Navbar />
<main aria-label="Authentication">
    {#if view === "login"}
        <Login />
        <footer>
            <p>
                Don't have an account? <button
                    type="button"
                    onclick={() => navigate("/register")}>Create one</button
                >
            </p>
            <p>
                forgot password? <button
                    type="button"
                    onclick={() => navigate("/forgot-password")}>Reset password</button
                >
            </p>
        </footer>
    {:else if view === "register"}
        <Register />
        <footer>
            <p>
                Already have an account? <button
                    type="button"
                    onclick={() => navigate("/login")}>Sign in</button
                >
            </p>
        </footer>
         {:else if view === "forgot-password"}
         <ForgotPassword></ForgotPassword>

        {:else}
        <ResetPassword {resetToken}></ResetPassword>

    {/if}
</main>

<style>
    footer {
        gap: 1vw;
        margin: 1rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
</style>
