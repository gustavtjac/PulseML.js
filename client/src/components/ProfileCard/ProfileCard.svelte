<script>
    import { onMount } from "svelte";
    import { user } from "../../stores/userStore.js";
    import { fetchGet, fetchPatch } from "../../util/fetchUtil.js";
    import { encodeImage } from "../../util/encodeUtil.js";
    import { toast } from "svelte-sonner";

    let name = $state("");
    let birthday = $state("");
    let weight = $state("");
    let gender = $state("");
    let country = $state(null);
    let fileInput;

    onMount(async () => {

        name = $user?.name;
        birthday = $user?.birthday;
        weight = $user?.weight;
        gender = $user?.gender;
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

    async function handleNameChange() {
        try {
            const result = await fetchPatch(`/api/users/${$user.id}`, { name });
            user.update(update => ({ ...update, name }));
            toast.success(result.data.successMessage);
        } catch (error) {
            toast.error(error.data.errorMessage);
        }
    }

    async function handleBirthdayChange() {
        try {
            const result = await fetchPatch(`/api/users/${$user.id}`, {  birthday  });
            user.update(update => ({ ...update, birthday }));
            toast.success(result.data.successMessage);
        } catch (error) {
            toast.error(error.data.errorMessage);
        }
    }

    async function handleWeightChange() {
        try {
            const result = await fetchPatch(`/api/users/${$user.id}`, { weight  });
            user.update(update => ({ ...update, weight: Number(weight) }));
            toast.success(result.data.successMessage);
        } catch (error) {
            toast.error(error.data.errorMessage);
        }
    }

    async function handleGenderChange() {
        try {
            const result = await fetchPatch(`/api/users/${$user.id}`, { gender });
            user.update(update => ({ ...update, gender: Number(gender) }));
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
        <input class="name-input" type="text" bind:value={name} onchange={handleNameChange}>
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
            <span class="label">USERNAME</span>
            <span>{$user?.username}</span>
        </div>
        <div class="info-row">
            <span class="label">EMAIL</span>
            <span>{$user?.email}</span>
        </div>
        <div class="info-row">
            <span class="label">BIRTHDAY</span>
            <input class="inline-input" type="date" bind:value={birthday} onchange={handleBirthdayChange} />
        </div>
        <div class="info-row">
            <span class="label">WEIGHT (KG)</span>
            <input class="inline-input" type="number" bind:value={weight} onchange={handleWeightChange} min="1" max="500"/>
        </div>
        <div class="info-row">
            <span class="label">GENDER</span>
            <select class="inline-select"  bind:value={gender} onchange={handleGenderChange}>
                <option value={0}>Male</option>
                <option value={1}>Female</option>
            </select>
        </div>
        <div class="info-row">
            <span class="label">MEMBER SINCE</span>
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


    .name-input {
        background: none;
        border: none;
        border-bottom: 1px solid transparent;
        border-radius: 0;
        color: var(--text);
        font-size: 1.3rem;
        font-weight: 700;
        font-family: inherit;
        text-align: center;
        width: auto;
        padding: 0;
        outline: none;
        transition: border-color 0.15s;
    }

    .name-input:hover {
        border-bottom-color: var(--text-muted);
    }

    .name-input:focus {
        border-bottom-color: var(--accent);
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

    .label {
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

    .inline-input {
        background: none;
        border: none;
        border-bottom: 1px solid transparent;
        border-radius: 0;
        color: var(--text);
        font-size: 0.95rem;
        font-family: inherit;
        text-align: right;
        width: 80px;
        padding: 0;
        outline: none;
        transition: border-color 0.15s;
    }

    .inline-input[type="date"] {
        width: auto;
        text-align: left;
        color-scheme: dark;
    }

    .inline-input:hover {
        border-bottom-color: var(--text-muted);
    }

    .inline-input:focus {
        border-bottom-color: var(--accent);
    }

    .inline-input[type="number"]::-webkit-inner-spin-button,
    .inline-input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
    }

    .inline-select {
        background: var(--bg-raised);
        border: 1px solid var(--border);
        border-radius: 6px;
        color: var(--text);
        font-size: 0.85rem;
        font-family: inherit;
        padding: 0.2rem 0.4rem;
        outline: none;
        cursor: pointer;
        max-width: 100px;
        text-align: right;
        direction: rtl;
    }

    .inline-select:focus {
        border-color: var(--accent);
    }
</style>
