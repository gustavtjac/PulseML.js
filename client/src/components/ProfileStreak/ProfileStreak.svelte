<script>

let { playStreak, publicProfile } = $props()


</script>


<main>
    <h2>Streak</h2>
{#if !playStreak || Number(playStreak) === 0}
    {#if !publicProfile}
        <span>Keep playing everyday to start a streak!</span>
    {/if}
    <h1>0 😵</h1>
    {:else}
    <h1>{Number(playStreak)}🔥</h1>
{/if}

</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
        gap: 0;
        margin: 2rem;
        background: var(--bg-surface);
        border-radius: 16px;
        overflow: hidden;
        color: var(--text);
        border: 1px solid var(--border);
        width: 10vw;
        height: 10vw;

    }


</style>
