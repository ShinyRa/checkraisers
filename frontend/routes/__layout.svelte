<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	const routes = [
		{ title: 'Home', route: '' },
		{ title: 'Draw cards', route: '/card' },
		{ title: 'register', route: '/register' },
		{ title: 'login', route: '/login' },
		{ title: 'profile', route: '/profile' },
	];
</script>

<section class="hero">
	<div class="hero-body">
		<p class="title">PokerApp</p>
		<p class="subtitle">By Auke & Tijs</p>
	</div>
</section>
<main>

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

	main {
		display: flex;
	}
	.menu {
		width: 10%;
		padding-top: 25px;
	}
</style>
