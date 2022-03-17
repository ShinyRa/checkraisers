<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/utils/Firebase';
	import { userAPI } from '$lib/api/user';
	import { fly } from 'svelte/transition';

	let user: string;
	let users = [];

	onMount(() => {
		const pokerRef = collection(db, 'user');
		onSnapshot(pokerRef, (querySnapshot) => {
			users = [];
			querySnapshot.forEach((doc) => {
				users = [...users, doc.data().name];
			});
		});
	});

	const adduser = () => {
		userAPI
			.addUser({
				username: user,
				name: user,
				surname: user,
				dateOfBirth: new Date(),
				totalChips: 1000
			})
			.then((res) => {
				console.log(res);
			});
	};

	const removeUser = () => {
		userAPI.removeUser(user).then((res) => {
				console.log(res);
			});
	}

	const getUser = () => {
		userAPI.getUsers().then((res) => {
			console.log(res);
		})
	}
</script>

<section>
	<div class="container">
		<input bind:value={user} /><br />
		<button on:click={adduser}>add user</button>
		<button on:click={removeUser}>remove user</button>
		<button on:click={getUser}>get all user</button>
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
