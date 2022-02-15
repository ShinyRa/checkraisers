<script lang="ts">
	import { onMount } from 'svelte';
	import { deckAPI } from '$lib/api/deck';
	import CardDeck from '$lib/entities/deck/CardDeck';
	import { default as PlayingCardData } from '$lib/entities/deck/card/PlayingCard';

	import PlayingCard from './_PlayingCard.svelte';

	let deck: CardDeck;
	let shown: Array<PlayingCardData> = [];

	const players = [
		{ hand: [], name: 'Tijs' },
		{ hand: [], name: 'Auke' },
		{ hand: [], name: 'Kimberley' },
		{ hand: [], name: 'Danny' }
	];

	onMount(() => {
		const data = deckAPI.shuffleDeck();
		deck = data.deck;
		players.forEach((player, index) => {
			let hand = [];
			[1, 2].forEach(() => (hand = deal(deck, player)));
			players[index].hand = hand;
		});
		[1, 2, 3].forEach(drawCard);
	});

	const drawCard = () => {
		if (shown.length < 5 && !deck.isEmpty()) {
			shown = [...shown, deck.draw()];
		}
	};

	const deal = (
		deck: CardDeck,
		player: { name: string; hand: PlayingCardData[] }
	): PlayingCardData[] => {
		const card = deck.draw();
		if (player.name === 'Tijs') {
			card.reveal();
		}
		player.hand.push(card);
		return player.hand;
	};
</script>

<section class="board">
	{#each players as player}
		<section class="player" class:you={player.name === 'Tijs'}>
			<h1>{player.name}</h1>
			{#each player.hand as card}
				<PlayingCard {card} />
			{/each}
		</section>
	{/each}
	<section class="cards">
		<button class="button is-large is-primary" disabled={shown.length >= 5} on:click={drawCard}
			>Draw</button
		>
		{#each shown as card}
			<PlayingCard {card} />
		{/each}
	</section>
</section>

<style lang="scss">
	.board {
		display: grid;
		grid-template:
			'player player player'
			'cards cards cards'
			'you you you';
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		background-color: #e3e3e3;
		height: 100%;
		width: 100%;
		padding: 50px;
		row-gap: 125px;

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

		.cards {
			grid-column-start: 1;
			grid-column-end: 4;
			display: grid;
			grid-template-columns: repeat(6, 1fr);
			gap: 15px;

			button {
				height: 100%;
				width: 100%;
			}
		}
	}
</style>
