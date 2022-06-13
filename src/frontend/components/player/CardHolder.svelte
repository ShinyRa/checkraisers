<script lang="ts">
	import type PlayingCard from '$lib/backend/entities/poker_rules/deck/card/PlayingCard';
	import { GameState } from '$lib/logic/frontend/components/match/GameState';
	import type { Match } from '$lib/logic/frontend/components/match/Match';
	import CPlayingCard from '../card/PlayingCard.svelte';

	export let matchData: Match;
	export let cards: PlayingCard[];
	export let findCard;

	console.log(cards);
</script>

<section class="card-holder">
	{#if matchData.state !== GameState.NOT_STARTED}
		{#each cards as card}
			<CPlayingCard {card} highlight={findCard(matchData.rounds.winner, card)} />
		{/each}
	{:else}
		<p>No cards dealt yet</p>
	{/if}
</section>

<style lang="scss">
	.card-holder {
		display: flex;
	}
</style>
