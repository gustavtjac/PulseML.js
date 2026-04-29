<script>
    import { onMount } from "svelte";
    import { user } from "../../stores/userStore.js";
    import { fetchGet, fetchPatch } from "../../util/fetchUtil.js";
    import { encodeImage } from "../../util/encodeUtil.js";
    import { toast } from "svelte-sonner";

    let country = null;
    let fileInput;

    onMount(async () => {
        try {
            if ($user?.country_id) {
                const result = await fetchGet(
                    `/api/countries/${$user.country_id}`,
                );
                country = result?.data?.country;
            }
        } catch (error) {
            console.log(error);
        }
    });


    async function handleFileChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const encoded = await encodeImage(file);
            const result = await fetchPatch(`/api/users/${$user.id}`, { profile_picture: encoded });
            user.update(update => ({ ...update, profile_picture: encoded }));
            toast.success(result.data.successMessage);
        } catch (error) {
            toast.error(error.data.errorMessage);
        }
    }
    
</script>

<input bind:this={fileInput} type="file" accept="image/*" onchange={handleFileChange} style="display:none" />

<main>
    <section id="topSection">
        <div class="avatar-wrapper" onclick={() => fileInput?.click()}>
            <img class="avatar" src={$user?.profile_picture} alt="Profile Pic" />
        </div>
        <h2>{$user?.name}</h2>
        <h3>@{$user?.username}</h3>
        {#if country}
            <div class="country-badge">
                <img
                    src="https://flagcdn.com/{country.code.toLowerCase()}.svg"
                    alt={country.name}
                />
                <p>{country.name}</p>
            </div>
        {/if}
    </section>

    <section class="info-section">
        <div class="info-row">
            <label>USERNAME</label>
            <span>{$user?.username}</span>
        </div>
        <div class="info-row">
            <label>EMAIL</label>
            <span>{$user?.email}</span>
        </div>
        <div class="info-row">
            <label>MEMBER SINCE</label>
            <span class="highlight">{$user?.created_at}</span>
        </div>
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

    .avatar-wrapper {
        position: relative;
        margin-bottom: 0.8rem;
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    .avatar-wrapper:hover {
        transform: scale(1.08);
    }

    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid transparent;
        background:
            linear-gradient(var(--bg-surface), var(--bg-surface)) padding-box,
            linear-gradient(135deg, var(--accent), var(--accent-dim)) border-box;
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

    .country-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.6rem;
        background: var(--bg-raised);
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 0.3rem 0.9rem;
        font-size: 0.85rem;
        color: var(--text-muted);
    }

    .country-badge img {
        width: 20px;
        height: auto;
        border-radius: 2px;
    }

    .country-badge p {
        margin: 0;
    }

    .info-section {
        border-top: 1px solid var(--border);
        display: flex;
        flex-direction: column;
    }

    .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        border-bottom: 1px solid var(--border);
    }

    label {
        font-size: 0.7rem;
        letter-spacing: 0.1em;
        color: var(--text-muted);
        text-transform: uppercase;
    }

    span {
        font-size: 0.95rem;
        color: var(--text);
    }

    .highlight {
        color: var(--accent);
        font-weight: 600;
    }
</style>
