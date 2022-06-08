<script lang="ts">
	import Player from '$lib/backend/entities/poker_rules/Player';
	import { default as PlayingCardData } from '$lib/backend/entities/poker_rules/deck/card/PlayingCard';
	import PlayingCard from '../card/PlayingCard.svelte';

	export let player: Player;
	export let you: boolean;
	export let highlight: PlayingCardData[];
</script>

<section class="player" class:you>
	<h1>{player.username}</h1>
	{#each player.hand.cards as card}
		<PlayingCard
			{card}
			highlight={highlight.find((toFind) => toFind.print() == card.print()) != undefined}
		/>
	{/each}
</section>

<style lang="scss">
	.player {
		grid-area: 'player';
		display: flex;
		justify-content: center;
	}

	.you {
		grid-area: you;
		grid-column-start: 1;
		grid-column-end: 4;
		justify-content: center;
	}
</style>
