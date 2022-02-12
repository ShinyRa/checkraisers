<script lang="ts">
	import { assets } from '$app/paths';
	import { Card } from '$lib/entities/deck/card/Card';
	import { CardSuit } from '$lib/entities/deck/card/CardSuit';
	import { CardValue } from '$lib/entities/deck/card/CardValue';

	import { fly } from 'svelte/transition';

	export let card: Card;

	// If card is facing up or down
	let faceUp = false;

	// If card face has been revealed
	let known = false;

	let suitName = CardSuit[card.suit].toLowerCase();
	let valueName = CardValue[card.value].toLowerCase();

	const reveal = () => {
		faceUp = !faceUp;
		known = true;
	};
</script>

<div
	class="card playingcard"
	on:mouseover={reveal}
	class:faceup={faceUp}
	in:fly={{ y: -40, x: 8, duration: 250 }}
>
	<img src="{assets}/cards/cardback.png" alt="Cardback" class="face" />
	{#if known}
		<img
			src="{assets}/cards/{valueName}_of_{suitName}.png"
			alt="{valueName} of {suitName}"
			class="face front"
		/>
	{/if}
</div>

<style lang="scss">
	.playingcard {
		height: 268px;
		width: 185px;
		border-radius: 8px;
		transform-style: preserve-3d;
		transition: transform 0.25s linear;
		position: relative;

		.face {
			position: absolute;
			-webkit-backface-visibility: hidden;
			backface-visibility: hidden;
			background-color: transparent;
		}

		.front {
			transform: rotateY(180deg);
			outline: 3px solid white;
			outline-offset: -2px;
		}
	}
	img {
		height: 100%;
		width: 100%;
		border-radius: 8px;
		pointer-events: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		user-select: none;
	}
	.playingcard:hover {
		cursor: pointer;
	}

	.faceup {
		transform: rotateY(180deg);
	}
</style>
