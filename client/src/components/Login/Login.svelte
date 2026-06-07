<script>
    import { fetchPost } from "../../util/fetchUtil.js";
    import { navigate } from "svelte-routing";
    import { toast } from "svelte-sonner";
    import { checkAuth } from "../../stores/userStore.js";

    let username = "";
    let password = "";
    let submitted = false;

    async function handleSubmit() {
        submitted = true;

        try {
            const result = await fetchPost("/auth/login", {
                username,
                password,
            });
            await checkAuth();
            toast.success(result.data.successMessage);
            navigate("/dashboard");
        } catch (error) {
            submitted = false;
            toast.error(error.data.errorMessage);
        }
    }
</script>

<section>
    <header>
        <h1>Sign in</h1>
        <p>Welcome back</p>
    </header>

    <form>
        <label for="username">Username</label>
        <input
            id="username"
            type="text"
            bind:value={username}
            placeholder="Username"
            required
        />

        <label for="password">Password</label>
        <input id="password" type="password" bind:value={password} required />

        <button onclick={handleSubmit} type="submit">
            {submitted ? "Signing in…" : "Sign in"}
        </button>
    </form>
</section>

<style>
    section {
        max-width: 40vw;
        margin: 3rem auto 0;
    }

    header {
        margin-bottom: 2rem;
    }

    header h1 {
        margin: 0 0 0.4rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    button {
        margin-top: 0.5rem;
        width: 100%;
    }
</style>
