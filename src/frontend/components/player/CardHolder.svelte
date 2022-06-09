<script lang="ts">
    import { CardIdentity } from '$lib/backend/entities/poker_rules/deck/card/identity/CardIdentity';
    import PlayingCard from '$lib/backend/entities/poker_rules/deck/card/PlayingCard';
	import CPlayingCard from '../card/PlayingCard.svelte';

	export let matchData;
	export let player;
</script>

<section class="card-holder">
    {#if matchData['started']}
        {#each player.hand.cards as card}
            <!--Should be rebuild in [matchName].svelte-->
            {@const cardRebuild = new PlayingCard(new CardIdentity(card.identity.suit, card.identity.value), card.state)}
            <CPlayingCard card={cardRebuild} highlight={false}/>
        {/each}
    {:else}
        <p>No cards dealt yet</p>
    {/if}
</section>

<style lang="scss">
    .card-holder{
        display: flex;
    }
</style>
