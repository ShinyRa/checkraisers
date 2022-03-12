<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { deckAPI } from '$lib/api/deck';
	import CardDeck from '$lib/entities/deck/CardDeck';
	import Player from '$lib/entities/user/Player';

	import { default as PlayingCardData } from '$lib/entities/deck/card/PlayingCard';
	import PlayingCard from './_PlayingCard.svelte';
	import { identity } from 'svelte/internal';
	import { getSupportInfo } from 'prettier';

	let deck: CardDeck;
	let shown: Array<PlayingCardData> = [];
	let highlight: Array<PlayingCardData> = [];
	let helptext = '';

	let players = [
		new Player().mock(),
		new Player().mock(),
		new Player().mock(),
		new Player().mock()
	];

	onMount(() => {
		const data = deckAPI.shuffleDeck();
		deck = data.deck;
		players.forEach((player) => {
			[1, 2].forEach(() => player.hand.deal(deck.draw()));
		});
		players = players;

		[1, 2, 3].forEach(drawCard);
	});

	const drawCard = () => {
		if (shown.length < 5 && !deck.isEmpty()) {
			const newCard = deck.draw();
			newCard.reveal();
			shown = [...shown, newCard];
		}

		if (shown.length == 5) {
			const hands = players.map((player) => player.hand);
			hands.map((hand) => hand.estimate(shown));
			hands.sort((hand1, hand2) => hand1.beats(hand2));
			highlight = hands[hands.length - 1].score.getCards();
			helptext = `${
				players.filter((player) => player.hand === hands[hands.length - 1])[0].name
			} won!`;
		}
	};

	const findCard = (highlight, card) => {
		return highlight.find((highlight) => highlight.print() == card.print()) != undefined;
	};
</script>

<section class="board">
	{#each players as player}
		<section class="player" class:you={player.name === players[0].name}>
			<h1>{player.name}</h1>
			{#each player.hand.cards as card}
				<PlayingCard {card} highlight={findCard(highlight, card)} />
			{/each}
		</section>
	{/each}
	{#if shown.length === 5}
		<section class="help" in:slide={{ duration: 175, easing: quintOut }}>
			<h1>{helptext}</h1>
		</section>
	{/if}
	<section class="cards">
		<button class="button is-large is-primary" disabled={shown.length >= 6} on:click={drawCard}
			>{shown.length >= 5 ? 'Evaluate' : 'Draw'}</button
		>
		{#each shown as card}
			<PlayingCard {card} highlight={findCard(highlight, card)} />
		{/each}
	</section>
</section>

<style lang="scss">
	.board {
		display: grid;
		grid-template:
			'player player player'
			'help help help'
			'cards cards cards'
			'you you you';
		grid-template-columns: repeat(3, 0.33fr);
		grid-template-rows: repeat(4, 0.25fr);
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

		.help {
			grid-area: help;
			display: flex;
			justify-content: center;
			grid-column-start: 1;
			grid-column-end: 4;
			font-size: 3em;
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
