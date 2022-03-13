<script lang="ts">
	import { fly } from 'svelte/transition';

	let user: string;
	let users = [];

	const getUser = async() => {
		await fetch(`/api/user/${user}`).then( resp => {
			if(resp.ok){
				return resp.json()
			}
		}).then(json => {
			console.log(json[0])
		})
	};


	const updateUser = async() => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: 'auke.steenman@gmail.com' })		
		};
		await fetch(`api/user/${user}`, requestOptions)
	}
</script>

<section>
	<div class="container">
		<input bind:value={user} /><br />
		<button on:click={getUser}>get user</button>
		<button on:click={updateUser}>update user</button>
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
