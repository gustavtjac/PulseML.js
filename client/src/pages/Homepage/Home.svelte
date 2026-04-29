<script>
    import Navbar from "../../components/Nav/Navbar.svelte";
    import  { user } from "../../stores/userStore.js"
</script>


<Navbar/>
<h2>Home / Dashboard {$user.name} </h2>



