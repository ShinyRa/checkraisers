<script context="module">
	export async function load({ session }) {
		session.authenticated = session.authenticated;
		if (session.authenticated) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		return {};
	}
</script>

<script lang="ts">
	import { type User } from '$lib/backend/entities/user/User';
	import UserClient from '$lib/logic/clients/user/UserClient';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/logic/frontend/entities/stores';
	import { session } from '$app/stores';

	let message;

	let user: Partial<User> = { email: '', password: '' };

	const login = async () => {
		let res = await UserClient.login(user);
		if (res['error']) {
			message = res['error'];
			return;
		} else {
			userStore.update((currentUser) => {
				currentUser.setUserData(res);
				return currentUser;
			});
			$session['authenticated'] = true;
			await goto('/');
		}
	};
</script>

<section>
	<div class="nes-container with-title">
		<p class="title">login</p>
		<div class="nes-field">
			<label for="name_field">email</label>
			<input class="nes-input" type="text" placeholder="Email" bind:value={user.email} required />
		</div>
		<div class="nes-field">
			<label for="name_field">password</label>
			<input
				class="nes-input input"
				type="password"
				placeholder="Password"
				bind:value={user.password}
				required
			/>
		</div>

		<button type="button" class="nes-btn is-primary" on:click={login}>login</button>
		{#if message}
			<span class="nes-text is-error">{message}</span>
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
		background-color: white;
	}

	.nes-field {
		padding: 8px 15px;
	}

	.nes-btn {
		margin: 35px 0px;
		width: 100%;
	}
</style>
