<script>
    import { onMount } from "svelte";
    import { Toaster } from "svelte-sonner";
    import { Router, Route } from "svelte-routing";
    import { checkAuth } from "./stores/userStore.js";
    import Home from "./pages/Homepage/Home.svelte";
    import Auth from "./pages/Auth/Auth.svelte";
    import Landing from "./pages/Landing/Landing.svelte";
    import RouteGuard from "./components/RouteGuard/RouteGuard.svelte";
    import Profile from "./pages/Profile/Profile.svelte";
    import Leaderboard from "./pages/Leaderboard/Leaderboard.svelte";
    import PublicProfile from "./pages/PublicProfile/PublicProfile.svelte";
    import GamePage from "./pages/GamePage/GamePage.svelte";

    onMount(() => checkAuth());
</script>

<Toaster />
<Router>
    <div>
        <Route path="/"><Landing /></Route>
        <Route path="/login"
            ><RouteGuard requireAuth={false}><Auth view="login" /></RouteGuard
            ></Route
        >
        <Route path="/register"
            ><RouteGuard requireAuth={false}
                ><Auth view="register" /></RouteGuard
            ></Route
        >
        <Route path="/dashboard"
            ><RouteGuard requireAuth={true}><Home /></RouteGuard></Route
        >
        <Route path="/profile"
            ><RouteGuard requireAuth={true}><Profile /></RouteGuard></Route
        >
        <Route path="/profile/:username" let:params>
            <RouteGuard requireAuth={true}>
                <PublicProfile username={params.username} />
            </RouteGuard>
        </Route>
        <Route path="/leaderboard"
            ><RouteGuard requireAuth={true}><Leaderboard /></RouteGuard></Route
        >

        <Route path="/games/:gameId" let:params>
            <RouteGuard requireAuth={true}>
                <GamePage gameId={params.gameId}></GamePage>
            </RouteGuard>
        </Route>
        <Route
            ><h1>404</h1>
            <p>This page does not exist.</p></Route
        >
    </div>
</Router>
