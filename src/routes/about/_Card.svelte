<script>
    import { fly } from 'svelte/transition';
    export let task;
</script>

<div class="task" in:fly={{x: -20, duration: 250}}>
    <p>{task}</p>
</div>