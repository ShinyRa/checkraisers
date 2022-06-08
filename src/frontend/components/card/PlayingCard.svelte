<script lang="ts">
	import { assets as assetsPath } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import PlayingCard from '$lib/backend/entities/poker_rules/deck/card/PlayingCard';

	export let card: PlayingCard;
	export let highlight: boolean;
</script>

<div
	class="card-container"
	class:highlight
	in:fly={{ duration: 175, x: 0, y: -40, easing: quintOut }}
>
	<div
		class="playingcard nes-pointer"
		on:click={() => (card = card.flip())}
		class:faceup={card.isRevealed()}
	>
		<img src="{assetsPath}/cards/{card.assetName()}" alt={card.print()} class="face front" />
		<img src="{assetsPath}/cards/cardback.png" alt="back" class="face" />
	</div>
</div>

<style lang="scss">
	.card-container {
		height: 182px;
		width: 125px;
		&.highlight {
			transition: transform 0.35s ease-out;
			border: 3px solid blue;
			border-radius: 15px;
			transform: scale(1.15);
			margin: 0 25px;
		}
		.playingcard {
			image-rendering: pixelated;
			height: 100%;
			width: 100%;
			transform-style: preserve-3d;
			transition: transform 0.175s linear;

			.face {
				position: absolute;
				-webkit-backface-visibility: hidden;
				backface-visibility: hidden;
			}

			.front {
				transform: rotateY(180deg);
			}
			img {
				height: 100%;
				width: 100%;
				border-radius: 7px;
				pointer-events: none;
				-moz-user-select: none;
				-webkit-user-select: none;
				user-select: none;
			}
		}
	}

	.faceup {
		transform: rotateY(180deg);
	}
</style>
