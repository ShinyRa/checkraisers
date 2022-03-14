<script lang="ts">
	import { onMount } from 'svelte';
	import { assets as assetsPath } from '$app/paths';
	import { fly } from 'svelte/transition';

	let load: boolean;
	onMount(() => (load = true));
</script>

{#if load}
	<section class="container" in:fly|local={{ x: -500, duration: 1250 }}>
		<img src="{assetsPath}/logo.png" alt="Logo" class="logo" />
		<p in:fly|local={{ y: -25, duration: 250, delay: 1250 }}>🚧 Under construction...</p>
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
