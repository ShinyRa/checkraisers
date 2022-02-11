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
</script>

<div
	class="playingcard"
	on:click={() => ((faceUp = !faceUp), (known = true))}
	class:faceup={faceUp}
	in:fly={{ y: 50, duration: 325 }}
>
	<img src="{assets}/alien.gif" alt="Cardback" class="face" />
	{#if known}
		<img
			src="{assets}/cards/{valueName}_of_{suitName}.png"
			alt="{valueName} of {suitName}"
			class="face front"
		/>
	{/if}
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
