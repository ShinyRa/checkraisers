<script lang="ts">
	import { fly } from 'svelte/transition';

	let user: string;
	let users = [];

	const getUser = async() => {
		const response = await fetch('/api/user')
    	console.log(await response.json())
	};
</script>

<section>
	<div class="container">
		<input bind:value={user} /><br />
		<button on:click={getUser}>get user</button>
	</div>

	<div class="container">
		<ul>
			{#each users as user}
				<p in:fly={{ x: -100, duration: 250, delay: 0 }}>{user}</p>
			{/each}
		</ul>
	</div>
</section>

<style lang="scss">
	section {
		margin: 0 auto;
	}
	.container {
		text-align: center;
		font-size: 40px;
	}
</style>
