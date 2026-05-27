<script>
    import { calcAge } from "../../util/dateUtil.js";
    let { profile } = $props();
</script>

<main>
    <section id="topSection">
        <div class="avatar-wrapper">
            <img
                class="avatar"
                src={profile.profile_picture}
                alt={profile.name ?? profile.username}
            />
        </div>
        <p class="display-name">{profile.name ?? profile.username}</p>
        <h3>@{profile.username}</h3>
        {#if profile.country_name}
            <div class="country-badge">
                <img
                    src="https://flagcdn.com/{profile.country_code.toLowerCase()}.svg"
                    alt={profile.country_name}
                />
                <p>{profile.country_name}</p>
            </div>
        {/if}
    </section>

    <section class="info-section">
        <div class="info-row">
            <span class="label">USERNAME</span>
            <span>{profile.username}</span>
        </div>
        {#if profile.birthday}
            <div class="info-row">
                <span class="label">AGE</span>
                <span>{calcAge(profile.birthday)}</span>
            </div>
        {/if}
        {#if profile.weight != null}
            <div class="info-row">
                <span class="label">WEIGHT</span>
                <span>{profile.weight} kg</span>
            </div>
        {/if}
        {#if profile.gender != null}
            <div class="info-row">
                <span class="label">GENDER</span>
                <span>{profile.gender === 0 ? "Male" : "Female"}</span>
            </div>
        {/if}
        <div class="info-row">
            <span class="label">MEMBER SINCE</span>
            <span class="highlight">{profile.created_at}</span>
        </div>
    </section>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 0;
        width: 320px;
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
        margin-bottom: 0.8rem;
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

    .display-name {
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
</style>
