<script lang="ts">
	import { fly } from 'svelte/transition';
	import { session } from '$app/stores'


	let user: string;
	let users = [];

	const getUser = async() => {
		await fetch(`/api/user/profile/${user}`).then( resp => {
			if(resp.ok){
				return resp.json()
			}
		}).then(json => {
			console.log(json)
		})
	};

	const updateUser = async() => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email:'auke.steenman@gmail.com', chips: 10000 })		
		};
		await fetch(`api/user/profile/${user}`, requestOptions)
	}

	const userSession = () => {
		console.log($session)
	}

	const registerUser = async() => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: 'auke.lips@gmail.com', username: 'kim', password: 'auke', chips:0 })		
		};
		await fetch(`api/user/register`, requestOptions).then( resp => {
			return resp.json()
		}).then(json => {
			console.log(json)
		})
	}

	const login = async() => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json',  'Accept': 'application/json'},
			body: JSON.stringify({ email: 'auke.lips@gmail.com', password: 'auke' })		
		};
		await fetch(`api/user/login`, requestOptions).then( resp => {
			return resp.json()
		}).then(json => {
			console.log(json)
			session.set(json)
		})
	}
</script>

<section>
	<div class="container">
		<input bind:value={user} /><br />
		<button on:click={getUser}>get user</button>
		<button on:click={updateUser}>update user</button>
		<button on:click={registerUser}>register user</button>
		<button on:click={login}>login user</button>
		<button on:click={userSession}>get session</button>
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
