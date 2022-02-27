<script lang="ts">
	import { assets as assetsPath } from '$app/paths';
	import PlayingCard from '$lib/entities/deck/card/PlayingCard';

	export let card: PlayingCard;
</script>

<div class="playingcard" on:click={() => (card = card.flip())} class:faceup={card.isRevealed()}>
	<img src="{assetsPath}/cards/{card.assetName()}" alt={card.print()} class="face front" />
	<img src="{assetsPath}/cards/cardback.png" alt="back" class="face" />
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
		}

		.front {
			transform: rotateY(180deg);
			padding: 5px;
			outline: 5px solid white;
			outline-offset: -7px;
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
	}

	.playingcard:hover {
		cursor: pointer;
	}

	.faceup {
		transform: rotateY(180deg);
	}
</style>
