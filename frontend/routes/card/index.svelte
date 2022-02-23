<script lang="ts">
	import { onMount } from 'svelte';
	import { deckAPI } from '$lib/api/deck';
	import CardDeck from '$lib/entities/deck/CardDeck';
	import { default as PlayingCardData } from '$lib/entities/deck/card/PlayingCard';
	import Player from '$lib/entities/user/Player';
	import Evaluation from '$lib/utils/hand/Evaluation';

	import PlayingCard from './_PlayingCard.svelte';

	let deck: CardDeck;
	let shown: Array<PlayingCardData> = [];

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
			if (player.username === 'Tijs') {
				player.hand.reveal();
			}
		});
		players = players;

		[1, 2, 3].forEach(drawCard);
	});

	const drawCard = () => {
		if (shown.length < 5 && !deck.isEmpty()) {
			const newCard = deck.draw();
			newCard.reveal();
			shown = [...shown, newCard];
		} else {
			Evaluation.findScore(players[0].hand, shown);
		}
	};
</script>

<section class="board">
	{#each players as player}
		<section class="player" class:you={player.name === players[0].name}>
			<h1>{player.name}</h1>
			{#each player.hand.cards as card}
				<PlayingCard {card} />
			{/each}
		</section>
	{/each}
	<section class="cards">
		<button class="button is-large is-primary" disabled={shown.length >= 6} on:click={drawCard}
			>{shown.length >= 5 ? 'Evaluate' : 'Draw'}</button
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
