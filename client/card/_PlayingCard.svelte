<script lang="ts">
	import { fly } from 'svelte/transition';
	import { CardValue } from './CardValue';
	import { CardSuit } from './CardSuit';
	import { onMount } from 'svelte';

	export let suit: number;
	export let value: number;

	let faceUp = false;

	let valueName = CardValue[value].toLowerCase();
	let suitName = CardSuit[suit].toLowerCase();

	onMount(() => {
		setInterval(() => {
			faceUp = !faceUp;
		}, Math.floor(Math.random() * 7000 + 750));
	});
</script>

<div
	class="playingcard"
	on:click={() => (faceUp = !faceUp)}
	class:faceup={faceUp === true}
	in:fly={{ y: 50, duration: 325 }}
>
	<img
		src="../Cards/{valueName}_of_{suitName}.png"
		alt="${valueName} of ${suitName}"
		class="face foreground"
	/>
	<img src="../Cards/cardback.png" alt="Cardback" class="face back" />
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
	}

	.playingcard {
		height: 430px;
		width: 300px;
		border-radius: 25px;
		transform-style: preserve-3d;
		transition: transform 0.25s ease-out;

		.face {
			position: absolute;
			-webkit-backface-visibility: hidden;
			backface-visibility: hidden;
		}

		.back {
			transform: rotateY(180deg);
		}
	}

	.playingcard:hover {
		cursor: pointer;
	}
</style>
