<script>
    import { fetchPost, fetchGet } from "../../util/fetchUtil.js";
    import { toast } from "svelte-sonner";
    import { navigate } from "svelte-routing";
    import { onMount } from "svelte";

    let username = $state("");
    let name = $state("");
    let email = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    let countryId = $state("");
    let birthday = $state("");
    let weight = $state("");
    let gender = $state("");
    let submitted = $state(false);

    let countries = $state([]);
    let selectedCountry = $derived(
        countries.find((country) => country.id === countryId),
    );

    async function handleSubmit(event) {
        event.preventDefault();
        submitted = true;
        try {
            const result = await fetchPost("/auth/register", {
                username,
                name,
                email,
                password1: password,
                password2: confirmPassword,
                countryId: Number(countryId),
                birthday,
                weight: Number(weight),
                gender: Number(gender),
            });
            toast.success(result.data.successMessage);
            navigate("/login");
        } catch (error) {
            submitted = false;
            toast.error(error.data.errorMessage);
        }
    }

    onMount(async () => {
        try {
            const result = await fetchGet("/api/countries");
            countries = result.data.countries;
        } catch (error) {
            toast.error(error.data.errorMessage);
        }
    });
</script>

<section>
    <header>
        <h1>Create account</h1>
        <p>Sign up to get started</p>
    </header>

    <form onsubmit={handleSubmit}>
        <label for="username">Username</label>
        <input
            id="username"
            type="text"
            bind:value={username}
            placeholder="gustavo1969"
            required
        />

        <label for="country">Country</label>

        <div class="country-select">
            {#if countryId}
                <img
                    src="https://flagcdn.com/{selectedCountry?.code.toLowerCase()}.svg"
                    width="24"
                    alt={selectedCountry?.name}
                />
            {/if}
            <select
                bind:value={countryId}
                required
                name="country_id"
                id="country"
            >
                <option value="" disabled>Select a country</option>
                {#each countries as country (country.id)}
                    <option value={country.id}>{country.name}</option>
                {/each}
            </select>
        </div>

        <label for="name">name</label>
        <input
            id="name"
            type="text"
            bind:value={name}
            placeholder="Gustavo"
            required
        />

        <label for="email">Email</label>
        <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="gustavo@roque.com"
            required
        />

        <label for="password">Password</label>
        <input id="password" type="password" bind:value={password} required />

        <label for="confirm-password">Confirm password</label>
        <input
            id="confirm-password"
            type="password"
            bind:value={confirmPassword}
            required
        />

        <label for="birthday">Birthday</label>
        <input id="birthday" type="date" bind:value={birthday} required />

        <label for="weight">Weight (kg)</label>
        <input
            id="weight"
            type="number"
            bind:value={weight}
            placeholder="70"
            min="1"
            max="500"
            step="0.1"
            required
        />

        <label for="gender">Gender</label>
        <select id="gender" bind:value={gender} required>
            <option value="" disabled>Select gender</option>
            <option value={0}>Male</option>
            <option value={1}>Female</option>
        </select>

        <button type="submit">
            {submitted ? "Creating account…" : "Create account"}
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

    .country-select {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    button {
        margin-top: 0.5rem;
        width: 100%;
    }
</style>
