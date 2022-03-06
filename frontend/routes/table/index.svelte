<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/utils/Firebase';
	import { userAPI } from '$lib/api/user';
	import { fly } from 'svelte/transition';

	let player: string;
	let players = [];

	onMount(() => {
		const pokerRef = collection(db, 'user');
		onSnapshot(pokerRef, (querySnapshot) => {
			players = [];
			querySnapshot.forEach((doc) => {
				players = [...players, doc.data().name];
			});
		});
	});

	const adduser = () => {
		userAPI
			.addUser({
				username: player,
				name: player,
				surname: player,
				dateOfBirth: new Date(),
				totalChips: 1000
			})
			.then((res) => {
				console.log(res);
			});
	};

	const removeuser = () => {
		userAPI.removeUser(player).then((res) => {
			console.log(res);
		});
	};
</script>

<section>
	<div class="container">
		<input bind:value={player} /><br />
		<button on:click={adduser}>add player</button>
		<button on:click={removeuser}>remove player</button>
	</div>

	<div class="container">
		<ul>
			{#each players as player}
				<p in:fly={{ x: -100, duration: 250, delay: 0 }}>{player}</p>
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
