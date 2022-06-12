<script>
	import { goto } from '$app/navigation';
	import { assets as assetsPath } from '$app/paths';
	import { userStore } from '$lib/logic/frontend/entities/stores';

	let user = $userStore.getUserData();

	userStore.subscribe((val) => {
		user = val.getUserData();
	});

	const gotoProfile = async () => {
		await goto('/profile');
	};

	const logout = async () => {
		await goto('/logout');
	};

	const home = async () => {
		await goto('/');
	};
</script>

{#if user}
	<nav class="navbar" role="navigation" aria-label="main navigation">
		<div class="navbar-start">
			<button class="navbar-item" on:click={home}>
				<img src={assetsPath + '/logo_icon.png'} alt="Checkraisers" />
				<span class="logo-title">Checkraisers</span>
			</button>
		</div>
		<div class="navbar-end">
			<button class="navbar-item" href="#" on:click={gotoProfile}>
				<div class="profile">
					<div class="details">
						<span>{user.username}</span>
						<span>chips: {user.chips}</span>
					</div>
					<div class="picture">
						<img
							class="is-rounded"
							src="{assetsPath}/avatars/{user.profilePicture}"
							alt="profile"
							style="image-rendering: pixelated; aspect-ratio: 1 / 1;"
						/>
					</div>
				</div>
			</button>
			<button class="navbar-item" href="#" on:click={logout}>
				<button class="nes-btn is-error">logout</button>
			</button>
		</div>
	</nav>
{/if}

<main>
	<slot />
</main>

<style lang="scss">
	$svelte: #ff3e00;
	button.navbar-item:hover {
		color: $svelte;
	}
	button.navbar-item {
		border: none;
		background: white;
	}
	.navbar {
		position: fixed;
		border-bottom: 2px solid black;
		width: 100%;
	}
	.navbar-item {
		display: flex;
		justify-content: center;
	}
	.navbar-item img {
		max-height: 3rem !important;
	}
	.profile {
		display: flex;
		flex-direction: row;
		text-align: right;
		.details {
			margin-right: 25px;
			display: flex;
			flex-direction: column;
		}
	}

	.logo-title {
		margin-left: 7px;
	}
	.is-rounded {
		border-radius: 100%;
	}

	.button {
		color: white;
		background-color: #802000;
		border: 0;
	}

	main {
		display: flex;
	}
	.menu {
		width: 10%;
		padding-top: 25px;
	}
</style>
