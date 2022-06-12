<script lang="ts">
	import { CardIdentity } from '$lib/backend/entities/poker_rules/deck/card/identity/CardIdentity';
	import PlayingCard from '$lib/backend/entities/poker_rules/deck/card/PlayingCard';
	import { GameState } from '$lib/logic/frontend/components/match/GameState';
	import type { Match } from '$lib/logic/frontend/components/match/Match';
	import CPlayingCard from '../card/PlayingCard.svelte';

	export let matchData: Match;
	export let player;
	export let findCard;
	console.log(findCard);
</script>

<section class="card-holder">
	{#if matchData.state !== GameState.NOT_STARTED}
		{#each player.hand.cards as card}
			<!--Should be rebuild in [matchName].svelte-->
			{@const cardRebuild = new PlayingCard(
				new CardIdentity(card.identity.suit, card.identity.value),
				card.state
			)}
			<CPlayingCard card={cardRebuild} highlight={findCard(matchData.rounds.winner, card)} />
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
