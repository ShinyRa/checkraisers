<script context="module">
	export async function load({ session }) {
		if (session.authenticated) {
			return {
				status: 302,
				redirect: '/profile'
			};
		}
		return {};
	}
</script>

<script lang="ts">
	import { type User } from '$lib/backend/entities/user/User';
	import UserClient from '$lib/logic/clients/user/UserClient';
	import { fly } from 'svelte/transition';
	import Util from '$lib/logic/frontend/generic/Util';
	import { goto } from '$app/navigation';

	let user: Partial<User> = { email: '', username: '', password: '' };
	let messageType;
	let message;

	const registerUser = async () => {
		await UserClient.register(user).then((res) => {
			messageType = Object.keys(res)[0];
			message = res[Object.keys(res)[0]];
		});
		if (messageType === 'success') {
			await Util.sleep(2000);
			goto('/login');
		}
	};
</script>

<section>
	<div class="nes-container with-title">
		<p class="title">register</p>
		<div class="nes-field">
			<label for="name_field">email</label>
			<input class="nes-input" type="email" placeholder="Email" bind:value={user.email} required />
		</div>
		<div class="nes-field">
			<label for="name_field">username</label>
			<input
				class="nes-input"
				type="text"
				placeholder="Username"
				bind:value={user.username}
				required
			/>
		</div>
		<div class="nes-field">
			<label for="name_field">password</label>
			<input
				class="nes-input"
				type="password"
				placeholder="Password"
				bind:value={user.password}
				required
			/>
		</div>

		<button type="button" class="nes-btn is-primary" on:click={registerUser}>create account</button>
		{#if messageType === 'error' && message}
			<span class="nes-text is-error" in:fly|local={{ y: -25, duration: 250 }}>{message}</span>
		{:else if message}
			<span class="nes-text is-success" in:fly|local={{ y: -25, duration: 250 }}>{message}</span>
		{/if}
	</div>
</section>

<style lang="scss">
	section {
		height: 100vh;
		width: 100vw;
		background-color: #ececec;
	}
	.nes-container {
		max-width: 725px;
		margin: 75px auto;
	}
	p.title {
		background-color: #ececec !important;
	}

	.nes-field {
		padding: 8px 15px;
	}

	.nes-btn {
		margin: 35px 0px;
		width: 100%;
	}
</style>
