<script context="module">
	export async function load({ session }) {
		session.authenticated = session.authenticated;
		if (session.authenticated) {
			return {
				status: 302,
				redirect: '/lobby'
			};
		}
		return {};
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { assets as assetsPath } from '$app/paths';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	let load: boolean;
	let timer: boolean;
	let keypressed: boolean;

	onMount(() => {
		load = true;
		timer = true;
		setInterval(() => {
			timer = !timer;
		}, 750);
		document.onkeydown = () => {
			keypressed = true;
		};
		document.onclick = () => {
			keypressed = true;
		};
	});

	const login = async () => {
		await goto('/login');
	};

	const register = async () => {
		await goto('/register');
	};
</script>

{#if load}
	<section class="background" style="background-image: url('{assetsPath}/pattern.png')">
		<section class="container">
			<img
				src="{assetsPath}/logo.png"
				alt="Logo"
				class="logo"
				in:fly|local={{ x: -500, duration: 1250, easing: expoOut }}
			/>
		</section>
		<section class="container">
			{#if !keypressed}
				<label>
					<input type="radio" class="nes-radio" checked={timer} />
					<span>Press any key to continue...</span>
				</label>
			{:else}
				<section class="menu">
					<div class="nes-container is-rounded message">
						<p>Welcome to <span class="nes-text is-error">CheckRaisers</span></p>
						<p>Please log in or create an account to start playing</p>
					</div>
					<a class="nes-btn" on:click={login} href="#">Login</a>
					<a class="nes-btn" on:click={register} href="#">Register</a>
				</section>
			{/if}
		</section>
	</section>
{/if}

<style lang="scss">
	$background: #ececec;
	.logo {
		image-rendering: pixelated;
	}
	.background {
		background-color: $background;
		width: 100vw;
		height: 100vh;
	}
	.background-card {
		position: absolute;
		height: 80px;
		width: 40px;
		transform-origin: right;
	}
	.container {
		margin-top: 120px;
		text-align: center;
		display: flex;
		flex-direction: column;
	}
	.message {
		background-color: $background;
		margin-bottom: 2em;
	}
	label {
		background-color: $background;
		padding: 2em;
	}
</style>
