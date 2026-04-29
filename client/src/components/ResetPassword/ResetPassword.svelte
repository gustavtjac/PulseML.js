<script>
    import { fetchPatch, fetchPost } from "../../util/fetchUtil.js";
    import { toast } from "svelte-sonner";
    import { user } from "../../stores/userStore.js"

    let currentPassword = $state("");
    let newPassword = $state("");
    let confirmNewPassword = $state("");
    let submitted = $state(false);

    async function handleSubmit(event) {
        event.preventDefault();

        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match");
            return;
        }

        submitted = true;
        try {
            const result = await fetchPatch(`/api/users/${$user.id}`, {
                currentPassword,
                newPassword,
                confirmNewPassword
            });
            toast.success(result.data.successMessage);
            currentPassword = "";
            newPassword = "";
            confirmNewPassword = "";
        } catch (error) {
            toast.error(error.data.errorMessage);
        } finally {
            submitted = false;
        }
    }
</script>

<main>
    <section id="topSection">
        <h2>Reset Password</h2>
        <h3>Update your credentials</h3>
    </section>

    <section class="form-section">
        <form onsubmit={handleSubmit}>
            <div class="form-row">
                <label for="current">CURRENT PASSWORD</label>
                <input
                    id="current"
                    type="password"
                    bind:value={currentPassword}
                    placeholder="••••••••"
                    required
                />
            </div>
            <div class="form-row">
                <label for="new">NEW PASSWORD</label>
                <input
                    id="new"
                    type="password"
                    bind:value={newPassword}
                    placeholder="••••••••"
                    required
                />
            </div>
            <div class="form-row">
                <label for="confirm">CONFIRM NEW PASSWORD</label>
                <input
                    id="confirm"
                    type="password"
                    bind:value={confirmNewPassword}
                    placeholder="••••••••"
                    required
                />
            </div>
            <div class="form-row">
                <button type="submit" disabled={submitted}>
                    {submitted ? "Updating…" : "Update Password"}
                </button>
            </div>
        </form>
    </section>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 0;
        width: 320px;
        margin: 2rem;
        background: var(--bg-surface);
        border-radius: 16px;
        overflow: hidden;
        color: var(--text);
        border: 1px solid var(--border);
    }

    #topSection {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2.5rem 2rem 2rem;
        gap: 0.4rem;
    }

    h2 {
        margin: 0;
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--text);
    }

    h3 {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 400;
        color: var(--accent);
    }

    .form-section {
        border-top: 1px solid var(--border);
        display: flex;
        flex-direction: column;
    }

    form {
        display: flex;
        flex-direction: column;
    }

    .form-row {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding: 1rem 2rem;
    }

    label {
        font-size: 0.7rem;
        letter-spacing: 0.1em;
        color: var(--text-muted);
        text-transform: uppercase;
        margin: 0;
    }

    input {
        background: var(--bg-raised);
        border: 1px solid var(--border);
        border-radius: 6px;
        color: var(--text);
        font-size: 0.9rem;
        padding: 0.5rem 0.75rem;
        width: 100%;
        outline: none;
        transition: border-color 0.15s;
    }

    input:focus {
        border-color: var(--accent);
    }

    button {
        width: 100%;
        margin: 0;
    }
</style>
