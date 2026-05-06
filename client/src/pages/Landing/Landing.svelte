<script>
    import Navbar from "../../components/Nav/Navbar.svelte";
    import { navigate } from "svelte-routing";
    import LeaderboardBanner from "../../components/LeadearboardBanner/LeaderboardBanner.svelte";
</script>



<Navbar/>
<LeaderboardBanner/>
<main>
    <header>
        <h1>PulseML.js</h1>
        <p>Play fun webcam games powered by machine learning — right in your browser. No downloads, no controllers, just you and your camera.</p>
    </header>

    <section>
        <h2>Why PulseML.js?</h2>
        <ul>
            <li>
                <h3>Webcam as a Controller</h3>
                <p>Use your face, hands, or body to control games. Machine learning tracks your movements in real time.</p>
            </li>
            <li>
                <h3>Runs in the Browser</h3>
                <p>Built with TensorFlow.js and MediaPipe — no installs required. Just open and play.</p>
            </li>
            <li>
                <h3>Track Your Scores</h3>
                <p>Create an account to save your highscores and see how you stack up against other players.</p>
            </li>
        </ul>
    </section>

    <section>
        <h2>Ready to play?</h2>
        <p>Create a free account and start playing webcam games powered by ML today.</p>
        <button onclick={() => navigate("/register")}>Get started</button>
    </section>
</main>

<style>
main {
padding: 3rem;
height: 80vh;
}


</style>