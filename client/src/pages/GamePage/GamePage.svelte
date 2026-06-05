<script>
    import Navbar from "../../components/Nav/Navbar.svelte";
    import LeaderboardBanner from "../../components/LeaderboardBanner/LeaderboardBanner.svelte";
    import { onMount, tick } from "svelte";
    import { fetchGet, fetchPost } from "../../util/fetchUtil.js";
    import { startWebcam, stopWebcam } from "../../util/webcamUtil.js";
    import {
        loadPoseLandmarker,
        startFrameLoop,
    } from "../../util/mediapipeUtil.js";
    import {
        loadModel,
        loadScaler,
        runInference,
    } from "../../util/onnxUtil.js";
    import { gameConfigs } from "../../util/gameConfigs.js";
    import confetti from "canvas-confetti";

    let { gameId } = $props();

    let game = $state(null);
    let phase = $state("start");
    let stream = $state(null);
    let videoEl = $state(null);
    let repCount = $state(0);
    let timeLeft = $state(20);
    let countdown = $state(null);
    let isPersonalBest = $state(false);

    let frameBuffer = [];
    let inRep = $state(false);

    function resetGame() {
        isPersonalBest = false;
        repCount = 0;
        timeLeft = 20;
        countdown = null;
        frameBuffer = [];
        inRep = false;
        phase = "start";
    }

    async function startCountdown() {
        countdown = 5;
        await tick();
        stream = await startWebcam(videoEl);
        const interval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(interval);
                countdown = null;
                phase = "playing";
            }
        }, 1000);
    }

    onMount(async () => {
        const result = await fetchGet(`/api/games/${gameId}`);
        game = result.data.game;
    });

    $effect(async () => {
        if (phase === "done") {
            const result = await fetchPost("/api/scores", {
                game_id: Number(gameId),
                score: repCount,
            });
            isPersonalBest = result.data.isPersonalBest;
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }
    });

    $effect(() => {
        if (phase === "playing") {
            const config = gameConfigs[gameId];
            let cancelLoop = null;

            async function setup() {
                const [poseLandmarker, session, scaler] = await Promise.all([
                    loadPoseLandmarker(),
                    loadModel(config.modelFile),
                    loadScaler(config.scalerFile),
                ]);

                cancelLoop = startFrameLoop(
                    videoEl,
                    poseLandmarker,
                    config,
                    async (features) => {
                        if (!features) return;

                        frameBuffer.push(features);
                        if (frameBuffer.length > 20) frameBuffer.shift();
                        if (frameBuffer.length < 20) return;

                        const prob = await runInference(
                            session,
                            frameBuffer,
                            scaler,
                        );

                        if (prob > 0.5 && !inRep) {
                            inRep = true;
                        } else if (prob <= 0.5 && inRep) {
                            inRep = false;
                            repCount++;
                        }
                    },
                );
            }

            setup();

            const timer = setInterval(() => {
                timeLeft--;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    phase = "done";
                }
            }, 1000);

            return () => {
                cancelLoop?.();
                stopWebcam(stream);
                clearInterval(timer);
            };
        }
    });
</script>

<svelte:head>
    <title>PulseML.js {game}</title>
</svelte:head>

<LeaderboardBanner />
<Navbar />

<main>
    {#if phase === "playing" || countdown !== null}
        <div class="game-container">
            <video bind:this={videoEl} autoplay playsinline></video>
            {#if countdown !== null}
                <div class="countdown-overlay">
                    <span class="countdown-number">{countdown}</span>
                    <p>Get ready!</p>
                </div>
            {/if}
            <div class="hud">
                <div class="hud-stat">
                    <span class="hud-label">Reps</span>
                    <span class="hud-value">{repCount}</span>
                </div>
                <div class="hud-stat">
                    <span class="hud-label">Position</span>
                    <span class="hud-value position">
                        {inRep
                            ? gameConfigs[gameId]?.positionLabels.down
                            : gameConfigs[gameId]?.positionLabels.up}
                    </span>
                </div>
                <div class="hud-stat">
                    <span class="hud-label">Time</span>
                    <span class="hud-value" class:urgent={timeLeft <= 5}
                        >{timeLeft}</span
                    >
                </div>
            </div>
        </div>
    {:else if phase === "done"}
        <div class="start-screen">
            <h1>Nice job!</h1>
            {#if isPersonalBest}
                <p>New Personal Best! 🏆</p>
            {/if}
            <p>{repCount} reps in 20 seconds</p>
            <button onclick={resetGame}>Play Again</button>
        </div>
    {:else if game}
        <div class="start-screen">
            <h1>{game.name}</h1>
            <p>{game.description}</p>
            <button onclick={startCountdown}>Start</button>
        </div>
    {:else}
        <div class="start-screen">
            <p>Loading...</p>
        </div>
    {/if}
</main>

<style>
    main {
        display: flex;
        justify-content: center;
        width: 100%;
        align-items: center;
        margin-top: 4vh;
    }

    .start-screen {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: rgba(0, 0, 0, 0.205);
        width: 60vw;
        border-radius: 50px;
        padding: 6vh;
    }

    .game-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        width: 40vw;
    }

    video {
        display: block;
        width: 100%;
        border-radius: 16px;
    }

    .hud {
        display: flex;
        gap: 3rem;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 12px;
        padding: 0.6rem 2rem;
        margin-top: 1rem;
    }

    .hud-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .hud-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .hud-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text);
        line-height: 1;
    }

    .hud-value.position {
        font-size: 1.2rem;
    }

    .hud-value.urgent {
        color: #f87171;
    }

    .countdown-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.45);
        border-radius: 16px;
        gap: 0.5rem;
    }

    .countdown-number {
        font-size: 8rem;
        font-weight: 700;
        color: var(--card-accent);
        line-height: 1;
    }
</style>
