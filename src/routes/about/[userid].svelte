<script lang="ts">
	import { page } from '$app/stores';
	import Card from './_Card.svelte';

	export let userid = $page.params.userid;

	let tasks = [];
	let todo;

	const add = () => {
		tasks = [...tasks, todo];
		todo = '';
	};
</script>

<h1>About {userid}!</h1>

<h3>This page does not work after refresh</h3>

<input bind:value={todo} />
<button on:click={add}>Click</button>

<div class="tasks">
	{#each tasks as task}
		<Card {task} />
	{/each}
</div>

<style lang="scss">
	.tasks {
		padding: 25px;
	}
</style>
