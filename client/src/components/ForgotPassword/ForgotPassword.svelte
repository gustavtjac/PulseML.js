<script>
    import { fetchPost } from "../../util/fetchUtil.js";
    import { navigate } from "svelte-routing";
    import { toast } from "svelte-sonner";

    let email = "";

    async function handleSubmit() {
        try {
            await fetchPost("/auth/forgot-password", {
                email,
            });
            toast.success(
                "You will recieve an email if it's associated with and account",
            );
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.log("hej");
            toast.error(error.data.errorMessage);
        }
    }
</script>

<section>
    <header>
        <h1>Reset Password</h1>
        <p>Reset your password to gain access to your account</p>
    </header>

    <label for="username">Email</label>
    <input
        id="email"
        type="email"
        bind:value={email}
        placeholder="gustavo@roque.dk"
        required
    />
    <button onclick={handleSubmit}>Reset</button>
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
