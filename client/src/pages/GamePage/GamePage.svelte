<script>
    import Navbar from "../../components/Nav/Navbar.svelte";
    import LeaderboardBanner from "../../components/LeaderboardBanner/LeaderboardBanner.svelte";
    import { onMount } from "svelte";
    import { fetchGet } from "../../util/fetchUtil.js";
    import { startWebcam, stopWebcam } from "../../util/webcamUtil.js";

    let { gameId } = $props();

    let game = $state(null);
    let phase = $state("start");
    let stream = $state(null);
    let videoEl = $state(null);

    onMount(async () => {
        const result = await fetchGet(`/api/games/${gameId}`);
        game = result.data.game;
    });

    $effect(() => {
      if (phase === "playing") {
          startWebcam(videoEl).then(s => stream = s);
          return () => stopWebcam(stream);
      }
  });

</script>

<LeaderboardBanner/>
<Navbar/>

<main>
      {#if phase === "playing"}
          <video bind:this={videoEl} autoplay playsinline></video>
      {:else if game}
          <div class="start-screen">
              <h1>{game.name}</h1>
              <p>{game.description}</p>
              <button onclick={() => phase = "playing"}>Start</button>
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
        margin-top: 10vh;
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

</style>

