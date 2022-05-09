<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { assets as assetsPath } from '$app/paths';
	import { socketStore, userStore } from '$lib/logic/frontend/entities/stores/userStore';

	let user = $userStore.getUserData()

	userStore.subscribe(val => {
		user = val.getUserData()
	})

	const routes = [
		{ title: 'profile', route: '/profile' },
		{ title: 'lobby', route: '/lobby' }
	];

	const gotoProfile = async() =>{
		await goto('/profile')
	}

	const logout = async() => {
		userStore.update(currentUser => {
			currentUser.clearUserData()
            return currentUser;
        });
		await goto('/logout')
	}

</script>

<section class="hero ">
	<div class="hero-body is-flex is-justify-content-space-between">
		<div>
			<p class="title">PokerApp</p>
			<p class="subtitle">By Auke & Tijs</p>
		</div>
		{#if user}
			<div class='is-flex'>
				<div class="pt-0 mr-3">
					<p class="is-size-5">{user.username}</p>
					<p class="is-size-6">chips: {user.chips}</p>
				</div>
				<figure class = "image is-square is-48x48 pt-1 is-clickable" on:click={gotoProfile}>
					<img class='is-rounded' src="{assetsPath}/avatars/{user.profilePicture}" alt='d'>
				</figure>
				<button class="is-size-7 mt-3 ml-3 button" on:click={logout}>logout</button>
			</div>

		{/if}
	</div>

</section>
<main>

	{#if user}
		<aside class="menu">
			<ul class="menu-list">
				{#each routes as { title, route }}
					<li>
						<a href={null} on:click={() => goto(`${base}${route}`)}>{title}</a>
					</li>
				{/each}
			</ul>
		</aside>
	{/if}

	<slot />
</main>

<style lang="scss">
	$svelte: #ff3e00;
	.hero {
		background-color: $svelte;
		p {
			color: white;
		}
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
