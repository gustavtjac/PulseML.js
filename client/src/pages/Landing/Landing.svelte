<script>
    import LeaderboardBanner from "../../components/LeaderboardBanner/LeaderboardBanner.svelte";
    import Navbar from "../../components/Nav/Navbar.svelte";
    import Footer from "../../components/Footer/Footer.svelte";

    import { navigate } from "svelte-routing";
    import { onMount, onDestroy } from "svelte";
    import { user } from "../../stores/userStore.js";

    const images = [
        "/slideshow/slideshow-1.png",
        "/slideshow/slideshow-2.png",
        "/slideshow/slideshow-3.png",
    ];
    let current = $state(0);
    let interval = $state();

    onMount(() => {
        interval = setInterval(() => {
            current = (current + 1) % images.length;
        }, 3000);
    });

    onDestroy(() => clearInterval(interval));
</script>

<svelte:head>
    <title>PulseML.js</title>
</svelte:head>

<LeaderboardBanner />
<Navbar />

<main>
    <section class="hero">
        <header>
            <h1>Webcam games.<br />No controller needed.</h1>
            <p>
                PulseML.js uses your camera and machine learning to track your
                movements in real time. Play directly in the browser — nothing
                to install.
            </p>
            <nav>
                {#if $user}
                    <button onclick={() => navigate("/dashboard")}
                        >Start gaming</button
                    >
                {:else}
                    <button onclick={() => navigate("/register")}
                        >Get started</button
                    >
                    <button class="ghost" onclick={() => navigate("/login")}
                        >Sign in</button
                    >
                {/if}
            </nav>
        </header>

        <div class="slideshow">
            {#each images as img, i (img.toString())}
                <img
                    src={img}
                    alt="game preview {i + 1}"
                    class:active={i === current}
                />
            {/each}
            <div class="dots">
                {#each images as dots, i (dots.toString())}
                    <button
                        class:active={i === current}
                        onclick={() => (current = i)}
                    ></button>
                {/each}
            </div>
        </div>
    </section>

    <section class="information-section">
        <div>
            <h3>Webcam as a controller</h3>
            <p>
                Use your face, hands, or body to play. MediaPipe and
                TensorFlow.js handle the tracking — no plugins, no hardware.
            </p>
        </div>
        <div>
            <h3>Runs in the browser</h3>
            <p>
                Everything runs client-side. Open a tab and start playing. Works
                on any modern browser with a webcam.
            </p>
        </div>
        <div>
            <h3>Live leaderboards</h3>
            <p>
                Scores update in real time via WebSockets. Create an account to
                save your highscores and compete with others.
            </p>
        </div>
    </section>

    <section class="next">
        <h2>Ready to play?</h2>
        {#if $user}
            <button onclick={() => navigate("/dashboard")}>Go to games!</button>
        {:else}
            <button onclick={() => navigate("/register")}
                >Create a free account</button
            >
        {/if}
    </section>
</main>

<Footer/>



<style>
    main {
        max-width: 60vw;
        margin: 0 auto;
        padding: 5rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 7rem;
    }

    .hero {
        display: flex;
        align-items: center;
        gap: 5rem;
    }

    .hero header {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .hero nav {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    h1 {
        font-size: clamp(2rem, 4vw, 3.2rem);
        line-height: 1.15;
        margin: 0;
        color: var(--text);
        letter-spacing: -0.03em;
    }

    .hero p {
        font-size: 0.95rem;
        color: var(--text-muted);
        line-height: 1.8;
        margin: 0;
        max-width: 420px;
    }

    .slideshow {
        flex: 1;
        position: relative;
        aspect-ratio: 16 / 9;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid var(--border);
        background: var(--bg-surface);
    }

    .slideshow img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.6s ease;
    }

    .slideshow img.active {
        opacity: 1;
    }

    .dots {
        position: absolute;
        bottom: 0.75rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 0.4rem;
    }

    .dots button {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        padding: 0;
        background: rgba(255, 255, 255, 0.3);
        border: none;
        cursor: pointer;
        transition: background 0.2s;
        min-width: unset;
    }

    .dots button.active {
        background: var(--accent);
    }

    .information-section {
        display: flex;
        gap: 3rem;
    }

    .information-section > div {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        padding-left: 1.5rem;
        border-left: 2px solid var(--border);
    }

    .information-section h3 {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text);
        margin: 0;
    }

    .information-section p {
        font-size: 0.82rem;
        color: var(--text-muted);
        margin: 0;
        line-height: 1.75;
    }

    .next {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1.5rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border);
    }

    .next h2 {
        font-size: clamp(1.6rem, 3vw, 2.4rem);
        color: var(--text);
        margin: 0;
        letter-spacing: -0.02em;
    }

    button {
        font-size: 0.82rem;
        font-weight: 700;
        border-radius: 4px;
        padding: 0.75rem 1.6rem;
        cursor: pointer;
        letter-spacing: 0.03em;
    }

    .ghost {
        background: transparent;
        color: var(--text-muted);
        border: 1px solid var(--border);
        font-weight: 500;
        transition:
            color 0.15s,
            border-color 0.15s;
    }

    .ghost:hover {
        color: var(--text);
        border-color: var(--text-muted);
        background: transparent;
    }
</style>
