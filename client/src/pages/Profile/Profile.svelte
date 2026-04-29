<script>
import Navbar from "../../components/Nav/Navbar.svelte";
import ProfileCard from "../../components/ProfileCard/ProfileCard.svelte";
import ResetPassword from "../../components/ResetPassword/ResetPassword.svelte";

</script>

<Navbar></Navbar>
<div class="cards-row">
    <ProfileCard/>
    <ResetPassword/>
</div>

<style>
    .cards-row {
        display: flex;
        justify-content: center;
        padding: 2rem;
    }
</style>