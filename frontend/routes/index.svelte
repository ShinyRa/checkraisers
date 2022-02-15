<script lang="ts">
	import { onMount } from 'svelte';
	import { assets as assetsPath } from '$app/paths';
	import { fly } from 'svelte/transition';

	let loaded = false;
	onMount(() => {
		loaded = true;
	});
</script>

{#if loaded}
	<section class="container" in:fly={{ x: -500, duration: 1250 }}>
		<img src="{assetsPath}/logo.png" alt="Logo" class="logo" />
		<p in:fly={{ y: -25, duration: 250, delay: 1250 }}>🚧 Under construction...</p>
	</section>
{/if}

<style lang="scss">
	.container {
		margin-top: 120px;
		text-align: center;
	}

	.logo {
		height: 300px;
		width: 300px;
		animation: 2.5s infinite spin forwards;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
