<script context="module">
	export const prerender = true;
	export async function load({ params: { userid } }) {
		return { props: { userid } };
	}
</script>

<script lang="ts">
	import Card from "./_Card.svelte";

	export let userid;

	let tasks = []
	let todo: string;

	const add = () => {
		tasks = [...tasks, todo]
		todo = ""
	}

</script>

<h1>About {userid}!</h1>

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

