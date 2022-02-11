<script lang="ts">
	import { fly } from 'svelte/transition';

	export let suit: string;
	export let value: string;

	let faceUp = false;

	let suitName = suit?.toLowerCase();
	let valueName = value?.toLowerCase();
</script>

<div
	class="playingcard"
	on:click={() => (faceUp = !faceUp)}
	class:faceup={faceUp}
	in:fly={{ y: 50, duration: 325 }}
>
	<img src="../alien.gif" alt="Cardback" class="face" />
	<img
		src="../Cards/{valueName}_of_{suitName}.png"
		alt="${valueName} of ${suitName}"
		class="face front"
	/>
</div>

<style lang="scss">
	.faceup {
		transform: rotateY(180deg);
	}

	img {
		pointer-events: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		user-select: none;
		height: 100%;
		width: 100%;
	}

	.playingcard {
		height: 280px;
		width: 190px;
		border-radius: 25px;
		transform-style: preserve-3d;
		transition: transform 0.25s ease-out;

		.face {
			position: absolute;
			-webkit-backface-visibility: hidden;
			backface-visibility: hidden;
		}

		.front {
			transform: rotateY(180deg);
		}
	}

	.playingcard:hover {
		cursor: pointer;
	}
</style>
