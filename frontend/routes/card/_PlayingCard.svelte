<script lang="ts">
	import { assets } from '$app/paths';
	import { Card } from '$lib/entities/deck/card/Card';
	import { CardState } from '$lib/entities/deck/card/CardState';
	import { CardSuit } from '$lib/entities/deck/card/CardSuit';
	import { CardValue } from '$lib/entities/deck/card/CardValue';

	import { fly } from 'svelte/transition';

	export let card: Card;

	// If card face has been revealed
	let known = card.state === CardState.REVEALED;

	// If card is animating in any way
	let animating = false;

	let suitName = CardSuit[card.suit].toLowerCase();
	let valueName = CardValue[card.value].toLowerCase();

	const flip = () => {
		if (animating) {
			return;
		}

		animating = true;

		card.state === CardState.REVEALED
			? (card.state = CardState.HIDDEN)
			: (card.state = CardState.REVEALED);
		known = true;
		setInterval(() => (animating = false), 375);
	};
</script>

<div
	class="card playingcard"
	on:click={flip}
	class:faceup={card.state === CardState.REVEALED}
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
		border-radius: 15px;
		transform-style: preserve-3d;
		transition: transform 0.25s linear;

		.face {
			position: absolute;
			-webkit-backface-visibility: hidden;
			backface-visibility: hidden;
			background-color: transparent;
		}

		.front {
			transform: rotateY(180deg);
			padding: 5px;
			outline: 5px solid white;
			outline-offset: -7px;
		}
	}
	img {
		height: 100%;
		width: 100%;
		border-radius: 15px;
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
