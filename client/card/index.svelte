<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let loaded = false;
	onMount(() => {
		loaded = true;
	});

	let facing = false; // FALSE = face down

	const flip = () => {
		facing = !facing;
	};
</script>

<section class="hero">
	<div class="hero-body">
		<p class="title">Card preview</p>
	</div>
</section>
<section class="preview">
	{#if loaded}
		<div
			class="card playingcard"
			on:click={flip}
			class:faceup={facing === true}
			in:fly={{ y: 50, duration: 325 }}
		>
			<img src="./Cards/HQ.png" alt="Queen of Hearts" class="face foreground" />
			<img src="./Cards/Back.png" alt="Queen of Hearts" class="face background" />
		</div>
	{/if}
</section>

<style lang="scss">
	$svelte: #ff3e00;

	.hero {
		background-color: $svelte;
		p {
			color: white;
		}
	}

	.preview {
		background-color: #e3e3e3;
		height: 88vh;
		padding-top: 125px;
		perspective: 800px;
	}

	.face {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}

	.faceup {
		transform: rotateY(180deg);
	}

	.foreground {
		height: 100%;
		width: 100%;
	}

	.background {
		transform: rotateY(180deg);
	}

	.playingcard {
		position: relative;
		margin: 0 auto;
		height: 430px;
		width: 300px;
		border-radius: 25px;
		transform-style: preserve-3d;
		transition: transform 0.35s ease-out;
	}
</style>
