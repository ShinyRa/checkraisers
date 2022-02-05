<script lang="ts">
	import Card from "./_Card.svelte";


	let tasks = []
	let todo: string;

	const add = () => {
		tasks = [...tasks, todo]
		todo = ""
	}

</script>

<h1>About!</h1>

<input bind:value={todo} />
<button on:click={add}>Click</button>

<div class="tasks">
	{#each tasks as task}
		<Card task={task} />
	{/each}
</div>

<style lang="scss">
	.tasks {
		padding: 25px;
	}
</style>

