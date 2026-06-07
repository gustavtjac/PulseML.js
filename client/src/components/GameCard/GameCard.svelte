<script>
    let { title, description, icon, onclick } = $props();
</script>


<button onclick={onclick}>
    <h1>{icon}</h1>
    <section>
        <h2>{title}</h2>
        <span>{description}</span>
    </section>
    <h1 class="arrow">></h1>
</button>

<style>

button {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1vw;
    background-color: var(--bg-surface);
}

button:hover {
    background-color: var(--bg-raised);
}

section {
    text-align: left;
    justify-content: center;
}

h2 {
    margin: 5px 5px 5px 0px;
    color: var(--text);
}

span {
    color: var(--text-muted);
}

.arrow {
    color: black;
}



</style>
